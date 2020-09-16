"use babel";

import React from "react";
import Masonry from "react-masonry-css";

export default class Root extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "",
      pics: [],
      pics2: [
        {
          url: "http://i.ytimg.com/vi/Awtlfye_3q0/maxresdefault.jpg"
        },
        {
          url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Water_collectors.jpg/1200px-Water_collectors.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/1fhp-HlwdS8/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/RIX0mjabsrE/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/BhtRHZzsMnI/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/RMkebnz13ys/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/TBQJ8DV-dpg/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/UKUfHrlPg2g/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/tIyTpnpob28/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/59Jd2o_FnqY/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/mB5z-iE5lJw/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/47ujmPOyA50/maxresdefault.jpg"
        },
        {
          url:
            "https://www.wikihow.com/images/b/b6/Chug-Water-Step-4-Version-2.jpg"
        },
        {
          url: "https://ak8.picdn.net/shutterstock/videos/11752748/thumb/1.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/31t9j47AsK0/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/l-qTP5NAlUI/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/hs43Biia4XY/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/ijY6mOZ81T0/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/_FwjFj3Ku5k/maxresdefault.jpg"
        },
        {
          url: "https://i.ytimg.com/vi/cKAk8Ha8ONo/maxresdefault.jpg"
        }
      ],
      gif: 0
    };
  }

  paste(ele) {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      editor.insertText(ele.target.alt);
      for (var modalPanel of atom.workspace.getModalPanels()) {
        if (modalPanel.item.id == "blueimage") {
          modalPanel.hide();
        }
      }
    }
  }

  async search() {
    var query = this.state.searchtext.trim().split(" ");
    var pics = [];

    var url =
      "https://api.qwant.com/api/search/images?count=100&t=images&safesearch=0&uiv=4&q=" +
      query.join(",");
    if (this.state.gif) url += "&imagetype=animatedgif";
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log("Qwant");
        for (var pic of res.data.result.items) {
          pics.push({
            url: pic.media,
            preview: "https:" + pic.thumbnail,
            src: "qwant"
          });
        }
      })
      .catch(err => {
        console.log("Error Qwant");
        console.log(err);
      });

    var apikey = "AIzaSyDD3VUzwtbrzVdEqKUlckfkD3E7G-e0HFI";
    var enginekey = "1075c25aada972859";

    url = `https://www.googleapis.com/customsearch/v1?key=${apikey}&cx=${enginekey}&searchType=image&q=${query.join(
      ","
    )}`;
    await fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log("Google");
        for (var pic of res.items) {
          pics.push({
            url: pic.link,
            preview: pic.image.thumbnailLink,
            src: "google"
          });
        }
      })
      .catch(err => {
        console.log("Error Google");
        console.log(err);
      });

    var page = 1;

    url =
      "https://api.pexels.com/v1/search?per_page=80&page=" +
      page +
      "&query=" +
      query.join("%20");

    await fetch(url, {
      method: "GET",
      headers: {
        Authorization:
          "563492ad6f917000010000013907bc8d6c2645b7a2cc156eb8765c51"
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log("Pexels");
        for (var pic of res.photos) {
          pics.push({
            url: pic.src.large,
            preview: pic.src.small
          });
        }
      })
      .catch(err => {
        console.log("Error Pexels");
        console.log(err);
      });

    console.log("Done");

    this.setState({
      pics: pics
    });
  }

  updatesearchvalue() {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      if (editor.getSelectedText() != "") {
        this.refs.search.value = editor.getSelectedText();
        this.updatesearchtext();
      }
    }
  }

  updatesearchtext() {
    this.setState(
      {
        searchtext: this.refs.search.value
      },
      this.search
    );
  }

  componentDidMount() {
    this.updatesearchvalue();
    // var ele = this.refs.displaypictures

    // atom.workspace.observeActiveTextEditor((editor)=>{
    //   this.updatesearchvalue()
    // })
  }

  render() {
    return (
      <div>
        <div className="viewheader">
          <input ref="search" className="input-search" type="text" />
          <span
            onClick={this.updatesearchtext.bind(this)}
            className="icon icon-search"
          ></span>
          <span
            onClick={this.updatesearchvalue.bind(this)}
            className="icon icon-sync"
          ></span>
        </div>
        <div className="display">
          <Masonry
            breakpointCols={3}
            className="displaypictures grid"
            columnClassName="column"
          >
            {this.state.pics &&
              this.state.pics.map((pic, i) => {
                return (
                  <div key={i} className="imagecontainer">
                    <img
                      onClick={this.paste.bind(this)}
                      src={this.state.gif ? pic.url : pic.url}
                      alt={pic.url}
                    />
                  </div>
                );
              })}
          </Masonry>
        </div>
      </div>
    );
  }
}
// <div className="displaypictures" ref="displaypictures">
// </div>

// pics: [{
//     "url": "http://i.ytimg.com/vi/Awtlfye_3q0/maxresdefault.jpg"
//   },
//   {
//     "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Water_collectors.jpg/1200px-Water_collectors.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/1fhp-HlwdS8/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/RIX0mjabsrE/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/BhtRHZzsMnI/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/RMkebnz13ys/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/TBQJ8DV-dpg/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/UKUfHrlPg2g/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/tIyTpnpob28/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/59Jd2o_FnqY/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/mB5z-iE5lJw/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/47ujmPOyA50/maxresdefault.jpg"
//   },
//   {
//     "url": "https://www.wikihow.com/images/b/b6/Chug-Water-Step-4-Version-2.jpg"
//   },
//   {
//     "url": "https://ak8.picdn.net/shutterstock/videos/11752748/thumb/1.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/31t9j47AsK0/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/l-qTP5NAlUI/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/hs43Biia4XY/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/ijY6mOZ81T0/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/_FwjFj3Ku5k/maxresdefault.jpg"
//   },
//   {
//     "url": "https://i.ytimg.com/vi/cKAk8Ha8ONo/maxresdefault.jpg"
//   }
// ]
