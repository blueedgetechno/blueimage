'use babel'

import BlueimageView from './blueimage-view'
import {
  CompositeDisposable
} from 'atom'

export default {

  blueimageView: null,
  subscriptions: null,
  editor: null,
  modalPanel: null,

  activate(state) {
    this.editor = atom.workspace.getActiveTextEditor()
    this.blueimageView = new BlueimageView(state.blueimageViewState)
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.blueimageView.getElement(),
      visible: false
    })

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'blueimage:toggle': () => this.toggle()
    }))
  },

  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.blueimageView.destroy()
  },

  serialize() {
    return {
      blueimageViewState: this.blueimageView.serialize()
    }
  },

  toggle() {
    return (this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show())
  }
}
