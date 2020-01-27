import React, { createContext, Fragment, PureComponent } from 'react';

import { PrintOnly, ScreenOnly } from './Media';


class ReferenceTracker {
  tracked = []
  listeners = []

  getIdx = url => {
    return this.tracked.findIndex(({ url: thisUrl }) => thisUrl === url);
  }
  _getNew = url => {
    const last = this.tracked[this.tracked.length - 1];
    const id = last ? last.id + 1 : 1;
    return { url, id, count: 0 };
  }
  get = url => {
    const idx = this.getIdx(url);
    return idx === -1 ? this._getNew(url) : this.tracked[idx];
  }
  exists = url => {
    return this.getIdx(url) !== -1;
  }
  add = (url, notifyChanges=true) => {
    const found = this.get(url);
    if (found.count <= 0) {
      this.tracked.push(found);
    }
    found.count += 1;

    if (notifyChanges) {
      this._notifyChanges();
    }

    return found.id;
  }
  remove = (url, notifyChanges=true) => {
    const idx = this.getIdx(url);
    if (idx === -1) {
      console.error('Attempt to remove untracked URL:', url);
      return;
    }
    const found = this.tracked[idx];
    found.count -= 1;

    if (notifyChanges) {
      this._notifyChanges();
    }
  }
  replace = (oldUrl, newUrl) => {
    this.remove(oldUrl, false);
    const id = this.add(newUrl, false);
    this._notifyChanges();
    return id;
  }

  _notifyChanges = () => {
    for (const func of this.listeners) {
      func()
    }
  }
  addListener = func => {
    this.listeners.push(func)
  }
  removeListener = func => {
    const idx = this.listeners.indexOf(func);
    if (idx === -1) {
      return
    }
    this.listeners.splice(idx, 1);
  }
}


const ReferencesContext = createContext(new ReferenceTracker());


export class PrintReferences extends PureComponent {
  static contextType = ReferencesContext;
  state = {
    links: [],
  }
  componentDidMount() {
    this.context.addListener(this.handleReferencesChanged);
    this.setState({ links: this.context.tracked });
  }
  componentWillUnmount() {
    this.context.removeListener(this.handleReferencesChanged);
  }
  handleReferencesChanged = () => {
    this.setState({ links: this.context.tracked });
  }
  render() {
    console.log('render', this.state.links)
    return (
      <Fragment>
        { this.state.links.map(link => <div>[{ link.id }]: { link.url }</div>) }
      </Fragment>
    );
  }
}

export class ReferenceLink extends PureComponent {
  static contextType = ReferencesContext;
  state = {
    id: null,
  }
  constructor(props) {
    super(props)
    console.log('construct')
  }
  componentDidMount() {
    console.log('href', this.props.href);
    this.setState({
      id: this.context.add(this.props.href),
    });
  }
  componentDidUpdate(prevProps) {
    console.log('href', prevProps.href, '->', this.props.href);
    if (prevProps.href !== this.props.href) {
      this.setState({
        id: this.context.replace(prevProps.href, this.props.href)
      });
    }
  }
  componentWillUnmount() {
    this.context.remove(this.props.href);
  }
  render() {
    const { children } = this.props;
    const { id } = this.state;

    return (
      <Fragment>
        <ExternalLink { ...this.props } />
        <PrintOnly>[{ id }]</PrintOnly>
      </Fragment>
    );
  }
}


export class ExternalLink extends PureComponent {
  render() {
    const { children, ...props } = this.props
    return <a rel="noopener noreferrer" target="_blank" { ...props }>{ children }</a>
  }
}
