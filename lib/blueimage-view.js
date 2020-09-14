'use babel'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './view/index'

export default class BlueimageView {

  constructor(serializedState) {
    this.element = document.createElement('div')

    this.element.classList.add('blueimage')
    this.element.id = "blueimage"
    ReactDOM.render( < div > < Root/></div > , this.element)
  }

  serialize() {
    
  }

  destroy() {
    this.element.remove()
  }

  getElement() {
    return this.element
  }

  getTitle() {
    return 'Blue Images'
  }

  getURI() {
    return 'atom://blueimage'
  }

}
