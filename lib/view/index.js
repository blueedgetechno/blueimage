'use babel';

import React from 'react';

export default class Root extends React.PureComponent {
  constructor(props) {
    super(props)
    this.editor = atom.workspace.getActiveTextEditor()
    this.state = {
      pics: [{
          "url": "http://i.ytimg.com/vi/Awtlfye_3q0/maxresdefault.jpg"
        },
        {
          "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Water_collectors.jpg/1200px-Water_collectors.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/1fhp-HlwdS8/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/RIX0mjabsrE/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/BhtRHZzsMnI/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/RMkebnz13ys/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/TBQJ8DV-dpg/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/UKUfHrlPg2g/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/tIyTpnpob28/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/59Jd2o_FnqY/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/mB5z-iE5lJw/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/47ujmPOyA50/maxresdefault.jpg"
        },
        {
          "url": "https://www.wikihow.com/images/b/b6/Chug-Water-Step-4-Version-2.jpg"
        },
        {
          "url": "https://ak8.picdn.net/shutterstock/videos/11752748/thumb/1.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/31t9j47AsK0/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/l-qTP5NAlUI/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/hs43Biia4XY/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/ijY6mOZ81T0/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/_FwjFj3Ku5k/maxresdefault.jpg"
        },
        {
          "url": "https://i.ytimg.com/vi/cKAk8Ha8ONo/maxresdefault.jpg"
        }
      ]
    }
  }

  paste(ele){
    if (this.editor) {
      this.editor.insertText(ele.target.src)
      for (var modalPanel of atom.workspace.getModalPanels()) {
        if(modalPanel.item.id=="blueimage"){
          console.log("destroy")
          modalPanel.destroy()
        }
      }
    }else{
      console.log("Nope")
    }
  }

  render() {
    return (
      <div>
        <div className="viewheader">
          <input ref="search" className="input-search" type="text"/>
          <span className="icon-search"></span>
        </div>
        <div className="display">
          <div className="container displaypictures">
            <div className="column1">
              {this.state.pics && this.state.pics.map((pic,i)=>{
                if(i%3==0){
                  return (
                    <div key={Math.floor(Math.random()*100000)} className="imagecontainer">
                      <img onClick={this.paste.bind(this)} src={pic.url} alt=""/>
                    </div>
                  )
                }else{
                  return null
                }
              })}
            </div>
            <div className="column2">
              {this.state.pics && this.state.pics.map((pic,i)=>{
                if(i%3==1){
                  return (
                    <div key={Math.floor(Math.random()*100000)} className="imagecontainer">
                      <img onClick={this.paste.bind(this)} src={pic.url} alt=""/>
                    </div>
                  )
                }else{
                  return null
                }
              })}
            </div>
            <div className="column3">
              {this.state.pics && this.state.pics.map((pic,i)=>{
                if(i%3==2){
                  return (
                    <div key={Math.floor(Math.random()*100000)} className="imagecontainer">
                      <img onClick={this.paste.bind(this)} src={pic.url} alt=""/>
                    </div>
                  )
                }else{
                  return null
                }
              })}
            </div>
          </div>
        </div>
			</div>
    );
  }
}