import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlStatus: 'initial',
      errorMessageUrlAlreadyShotened: 'URL already shortened',
      errorMessageShortURLTaken: 'Short URL already taken',
      websiteDomain: 'http://url-shortener/',
      shortURL: '',
      originalURL: ''
    };
  }

  shortenAction() {
    const { originalURL } = this.state;
    fetch(`/api/is-original-url-saved?originalURL=${originalURL}`)
    .then(res => res.json())
    .then(result => {
      if(result.isSaved) {
        this.setState({
          urlStatus: 'shortenFailure'
        });
      } else {
        fetch('/api/generate').then(res => res.json())
        .then(result => {
          this.setState({
            urlStatus: 'shortenSuccess',
            shortURL: result.shortURLPath
          })
        })
      }
    })
  }

  activationAction() {
    const { originalURL, shortURL } = this.state;
    fetch(`/api/is-short-url-available?shortURL=${shortURL}`)
    .then(res => res.json())
    .then(result => {
      if(!result.isAvailable) {
        this.setState({
          urlStatus: 'activationFailure'
        });
      } else {
        fetch('/api/save-original-url', {
          method: 'post',
          body: JSON.stringify({originalURL: originalURL, shortURL: shortURL}),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json)
        .then(result => {
          this.setState({
            urlStatus: 'activationSuccess',
          })
        })
      }
    })
  }

  copyLink() {
    this.link.select();
    document.execCommand('copy');
  }

  render() {
    return (
      <div className="app">
        <header>
          <h1 className="logo">SHORT URL</h1>
        </header>
        <main>
          <div className="input_group small_left_column">
            <label className="push_right label">URL:</label>
            <div className={this.state.urlStatus == 'shortenFailure' ? 'field error': 'field'}
              data-error-message={this.state.errorMessageUrlAlreadyShotened}>
              <input type="text" className="input_value"
                onChange={this.updateOriginalURL.bind(this)} value={this.state.originalURL}
                disabled={(this.state.urlStatus == 'initial' || this.state.urlStatus == 'shortenFailure') ? false: true}/>
            </div>
          </div>
          <div className="group">
            <button class="centered" disabled={(this.state.urlStatus == 'initial' || this.state.urlStatus == 'shortenFailure') ? false: true}
              onClick={this.shortenAction.bind(this)}>Shorten</button>
          </div>
          <div className={(this.state.urlStatus == 'shortenSuccess' || this.state.urlStatus == 'activationFailure') ? 'group': 'hidden'}>
            <div className="input_group small_right_column">
                <div className="push_right">
                    <label className="label small_label">{this.state.websiteDomain}</label>
                    <div className={this.state.urlStatus == 'activationFailure' ? 'field error': 'field'}
                        data-error-message={this.state.errorMessageShortURLTaken}>
                      <input type="text" className="input_value small_input_value"
                        onChange={this.updateShortURL.bind(this)} value={this.state.shortURL}/>
                    </div>
                </div>
                <button className="small_button" onClick={this.activationAction.bind(this)}>Activate</button>
            </div>
          </div>
          <div className={this.state.urlStatus == 'activationSuccess' ? 'group': 'hidden'}>
            <div className="input_group small_right_column">
                <label className="label small_label push_right">
                    <input type="hidden" ref={(link) => this.link = link} 
                     value={this.state.websiteDomain + this.state.shortURL} />
                    <a href="https://url-shortener/hello" rel="noopener noreferrer" 
                        target="_blank">{this.state.websiteDomain}{this.state.shortURL}</a>
                </label>
                <button className="small_button" onClick={this.copyLink.bind(this)}>Copy link</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  updateOriginalURL(evt) {
    this.setState({
      originalURL: evt.target.value
    });
  }

  updateShortURL(evt) {
    this.setState({
      shortURL: evt.target.value
    });
  }
}

export default App;