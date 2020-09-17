"use babel"

import React from "react"
import Masonry from "react-masonry-css"

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchtext: "",
      pics: [],
      page: 1,
      loadmore: true,
      config: {
        qwant: true,
        pixabay: true,
        google: true,
        pexels: true,
        flickr: false
      }
    }
  }

  paste(ele) {
    var editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      var pic = this.state.pics[ele.target.alt]
      editor.insertText(pic.url + pic.src)
      for (var modalPanel of atom.workspace.getModalPanels()) {
        if (modalPanel.item.id == "blueimage") {
          modalPanel.hide()
        }
      }
    }
  }

  fetchQwant(query) {
    var url = "https://api.qwant.com/api/search/images?count=150&t=images&safesearch=0&uiv=4&q=" + query.join(",")
    fetch(url).then(res => res.json()).then(res => {
      console.log("Searching Qwant")
      var pics = this.state.pics
      for (var pic of res.data.result.items) {
        pics.push({
          url: pic.media,
          preview: "https:" + pic.thumbnail,
          src: ""
        })
      }
      this.setState({pics: pics})
    }).catch(err => {
      console.log("Error Qwant")
      console.log(err)
    })
  }

  fetchGoogle(query) {
    var apikey = "AIzaSyDD3VUzwtbrzVdEqKUlckfkD3E7G-e0HFI"
    var enginekey = "1075c25aada972859"

    url = `https://www.googleapis.com/customsearch/v1?key=${apikey}&cx=${enginekey}&searchType=image&q=${query.join(",")}`
    fetch(url).then(res => res.json()).then(res => {
      console.log("Searching Google")
      var pics = this.state.pics
      for (var pic of res.items) {
        pics.push({
          url: pic.link, preview: pic.link, //image.thumbnailLink,
          src: ""
        })
      }
      this.setState({pics: pics})
    }).catch(err => {
      console.log("Error Google")
      console.log(err)
    })
  }

  fetchPexels(query) {
    var page = this.state.page
    url = "https://api.pexels.com/v1/search?per_page=80&page=" + page + "&query=" + query.join("%20")
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "563492ad6f917000010000013907bc8d6c2645b7a2cc156eb8765c51"
      }
    }).then(res => res.json()).then(res => {
      console.log("Searching Pexels")
      var pics = this.state.pics
      for (var pic of res.photos) {
        pics.push({
          url: pic.src.large,
          preview: pic.src.large,
          src: " (src:" + pic.photographer_url + ")"
        })
      }
      this.setState({pics: pics})
    }).catch(err => {
      console.log("Error Pexels")
      console.log(err)
    })
  }

  fetchPixabay(query) {
    var page = this.state.page
    var apikey = "16584935-732689d72ee72861d5f1ced4c"
    url = "https://pixabay.com/api/?key=" + apikey + "&per_page=200&page=" + page + "&q=" + query.join("+")
    fetch(url).then(res => res.json()).then((res) => {
      console.log("Searching Pixabay")
      var pics = this.state.pics
      for (var pic of res.hits) {
        pics.push({
          url: pic.largeImageURL,
          preview: pic.webformatURL,
          src: " (src:https://pixabay.com/users/" + pic.user + "-" + pic.user_id + ")"
        })
      }
      this.setState({pics: pics})
    }).catch(err => {
      console.log("Error Pixabay");
      console.log(err)
    })
  }

  fetchFlickr(query) {
    var page = this.state.page
    var apikey = "938fc2f7c6a0d81bef89819586fc3e3d"
    var url = "https://api.flickr.com/services/rest?method=flickr.photos.search"
    var opt = `&api_key=${apikey}&page=${page}&format=json&nojsoncallback=1&text=` + query.join("%20")
    url += opt

    fetch(url, {
      "headers": {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(async (res) => {
      console.log("Searching flickr");
      var pics = this.state.pics
      for (var photo of res.photos.photo) {
        pics.push({
          url: (await `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_o.jpg`),
          preview: (await `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`),
          src: " (src:" + 'https://www.flickr.com/photos/' + photo.owner + ")"
        })
      }
      this.setState({pics: pics})
    }).catch(err => {
      console.log("Err flickr")
      console.log(err)
    })
  }

  async search() {
    var query = this.state.searchtext.trim().split(" ")
    await this.setState({pics: []})

    if (this.state.config.qwant) {
      this.fetchQwant(query)
    }
    if (this.state.config.google) {
      this.fetchGoogle(query)
    }
    if (this.state.config.pexels) {
      this.fetchPexels(query)
    }
    if (this.state.config.pixabay) {
      this.fetchPixabay(query)
    }
    if (this.state.config.flickr) {
      this.fetchFlickr(query)
    }
  }

  loadmore() {
    var query = this.state.searchtext.trim().split(" ")
    this.setState({page: this.state.page+1}, ()=>{
      if (this.state.config.pexels) {
        this.fetchPexels(query)
      }
      if (this.state.config.pixabay) {
        this.fetchPixabay(query)
      }
      if (this.state.config.flickr) {
        this.fetchFlickr(query)
      }
    })
  }

  updatesearchvalue() {
    var editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      if (editor.getSelectedText() != "") {
        this.refs.search.value = editor.getSelectedText()
        this.updatesearchtext()
      }
    }
  }

  updatesearchtext() {
    this.setState({
      searchtext: this.refs.search.value,
      page: 1
    }, this.search)
  }

  expand(ele) {
    var dom = ele.target
    if (dom.classList.contains('search-filter')) {
      dom.classList.toggle('icon-chevron-right')
      dom.classList.toggle('icon-chevron-down')
      dom.children[0].classList.toggle('dropped')
    }
  }

  updateconfig() {
    var config = {
      qwant: this.refs.qwant.checked,
      google: this.refs.google.checked,
      pexels: this.refs.pexels.checked,
      pixabay: this.refs.pixabay.checked,
      flickr: this.refs.flickr.checked
    }
    this.setState({
      config: config
    }, this.updatesearchvalue)
  }

  componentDidMount() {
    this.updatesearchvalue()
  }

  render() {
    return (<div>
      <div className="viewheader">
        <input ref="search" className="input-search" type="text"/>
        <div onClick={this.expand.bind(this)} className="search-filter icon-chevron-right">
          services
          <div className="service-options dropped">
            <label className='input-label'>
              <input onChange={this.updateconfig.bind(this)} ref="qwant" className='input-checkbox' type='checkbox' checked={this.state.config.qwant} name='qwant'/>
              Qwant</label>
            <label className='input-label'>
              <input onChange={this.updateconfig.bind(this)} ref="google" className='input-checkbox' type='checkbox' checked={this.state.config.google} name='google'/>
              Google</label>
            <label className='input-label'>
              <input onChange={this.updateconfig.bind(this)} ref="pexels" className='input-checkbox' type='checkbox' checked={this.state.config.pexels} name='pexels'/>
              Pexels</label>
            <label className='input-label'>
              <input onChange={this.updateconfig.bind(this)} ref="pixabay" className='input-checkbox' type='checkbox' checked={this.state.config.pixabay} name='pixabay'/>
              Pixabay</label>
            <label className='input-label'>
              <input onChange={this.updateconfig.bind(this)} ref="flickr" className='input-checkbox' type='checkbox' checked={this.state.config.flickr} name='flickr'/>
              Flickr</label>
          </div>
        </div>
        <span onClick={this.updatesearchtext.bind(this)} className="icon icon-search"></span>
        <span onClick={this.updatesearchvalue.bind(this)} className="icon icon-sync"></span>
      </div>
      <div className="display">
        <Masonry breakpointCols={3} className="displaypictures grid" columnClassName="column">
          {
            this.state.pics.map((pic, i) => {
              return (<div key={i} className="imagecontainer">
                <img onClick={this.paste.bind(this)} src={pic.preview} alt={i}/>
              </div>)
            })
          }
        </Masonry>
        {
          this.state.pics.length == 0
            ? (<div className="emptysearch">
              <span className="icon icon-telescope"></span>
              <ul className='background-message'>
                <li>Empty</li>
              </ul>
            </div>)
            : null
        }

        {
          this.state.pics.length != 0 && (this.state.config.pexels || this.state.config.pixabay || this.state.config.flickr)
            ? (<div className="loadmore">
              <button onClick={this.loadmore.bind(this)} className="btn">Load more</button>
            </div>)
            : null
        }
      </div>
    </div>)
  }
}

// <div className="displaypictures" ref="displaypictures">
// </div>
