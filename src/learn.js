/* globals d3 */

class Model {
  constructor (structure) {
    this.structure = structure || null;
    // this.inferAttributes(elements);
  }
  getEnterFunction () {
    if (!this.structure) {
      throw new Error('Model not trained');
    }
    let self = this;

    return function (data, index) {
      let rootPlaceholder = d3.select(this);
      let rootElement = rootPlaceholder.append(self.structure.tag);
      let recurse = (parentElement, children) => {
        children.forEach(child => {
          let childElement = parentElement.append(child.tag);
          recurse(childElement, child.children || []);
        });
      };
      recurse(rootElement, self.structure.children || []);
    };
  }
  getReadableStructureString () {
    if (!this.structure) {
      throw new Error('Model not trained');
    }
    let recurse = (children) => {
      return children.map(child => {
        let childStr = recurse(child.children || []);
        return child.tag + (childStr ? '(' + childStr + ')' : '');
      }).join(',');
    };
    let subStr = recurse(this.structure.children || []);
    return this.structure.tag + (subStr ? '(' + subStr + ')' : '');
  }
  getCommonChildTags (elementLists) {
    if (elementLists.length === 0) {
      return null;
    }
    let firstList = elementLists[0];
    let otherLists = elementLists.slice(1);
    let length = firstList.length;
    // validate that there are child elements, and all lists have the same length
    if (length === 0 || !otherLists.every(elements => elements.length === length)) {
      return null;
    }
    let tagList = firstList.map(el => el.tagName);
    // validate that all lists have the same series of tags
    let allMatch = otherLists.every(elements => {
      return elements.every((el, index) => el.tagName === tagList[index]);
    });
    return allMatch ? tagList : null;
  }
  inferSubstructure (rootElements, ancestorList) {
    let selector = ':scope ' + ancestorList.map(tagObj => {
      let index = tagObj.tagIndex + 1; // nth-child counts from 1, not 0
      return tagObj.tag + ':nth-child(' + index + ')';
    }).join(' ');
    let parentElements = rootElements.map(el => el.querySelector(selector));
    let childElementLists = parentElements.map(el => Array.from(el.children));
    let childTagList = this.getCommonChildTags(childElementLists);
    if (!childTagList) {
      return null;
    } else {
      return childTagList.map((childTag, childTagIndex) => {
        let newAncestorList = Array.from(ancestorList);
        newAncestorList.push({
          tag: childTag,
          tagIndex: childTagIndex
        });
        let substructure = { tag: childTag };
        let subsubstructure = this.inferSubstructure(rootElements, newAncestorList);
        if (subsubstructure) {
          substructure.children = subsubstructure;
        }
        return substructure;
      });
    }
  }
  inferStructure (elements) {
    if (!elements || elements.length === 0) {
      throw new Error('Selection can not be empty');
    }
    // validate that all the parent nodes have the same tag
    let structure = {
      tag: elements[0].tagName
    };
    if (!elements.every(el => el.tagName === structure.tag)) {
      throw new Error('At least the root tag of every element must match');
    }
    // find patterns in the children
    let childElementLists = elements.map(el => Array.from(el.children));
    let childTagList = this.getCommonChildTags(childElementLists);

    if (childTagList) {
      // Add common child lists in a depth-first traversal
      structure.children = childTagList.map((tag, tagIndex) => {
        let substructure = { tag };
        let subsubstructure = this.inferSubstructure(elements, [{ tag, tagIndex }]);
        if (subsubstructure) {
          substructure.children = subsubstructure;
        }
        return substructure;
      });
    }

    this.structure = structure;
  }
}

// export default Model;
