import React, { Component } from 'react';
import { controllerContext } from './contContext';
import Controller from './Controller';
interface Props {
  parentRef: React.RefObject<HTMLDivElement>;
}
interface State {
  dimms?: {
    width: number;
    height: number;
  };
  canSeeGL: boolean;
}

export default class Visuals extends Component<Props, State> {
  state: State = { dimms: undefined, canSeeGL: true };
  static contextType = controllerContext;
  context!: Controller;
  container?: HTMLDivElement;
  videoRef = React.createRef<HTMLVideoElement>();
  glRef = React.createRef<HTMLCanvasElement>();
  canvRef = React.createRef<HTMLCanvasElement>();
  hasAttCanv = false;
  componentDidMount() {
    const { width } = this.container!.getBoundingClientRect();
    const newHeight = 0.75 * width;
    this.setState({ dimms: { width, height: newHeight }, canSeeGL: true });
  }
  componentDidUpdate() {
    if (this.state.dimms && !this.hasAttCanv) {
      this.context.attachGLcanvas(this.glRef.current!);
      this.context.attachTextCanvas(this.canvRef.current!);
      this.context.attachVideoCanvas(this.videoRef.current!);
      this.hasAttCanv = !this.hasAttCanv;
    }
  }
  onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'h') {
      this.setState({ canSeeGL: !this.state.canSeeGL });
      console.log('keyPresssed is h');
      return;
    }
    console.log(`key is ${event.key}`);
  };
  renderContent() {
    const wid = Math.floor(this.state.dimms!.width);
    const hei = Math.floor(this.state.dimms!.height);
    return (
      <>
        <video
          ref={this.videoRef}
          width={wid}
          height={hei}
          loop
          muted
          style={{ opacity: '0%' }}
          autoPlay
          src={this.context.videoURL}
        >
          <source />
        </video>
        <canvas
          style={{
            position: 'relative',
            left: '0px',
            top: `-${hei}px`,
            opacity: this.state.canSeeGL ? '100%' : '0%',
          }}
          id='gl'
          width={wid}
          height={hei}
          ref={this.glRef}
        ></canvas>
        <canvas
          id='text'
          style={{
            position: 'relative',
            left: '0px',
            top: `-${2 * hei}px`,
            opacity: this.state.canSeeGL ? '0%' : '100%',
          }}
          width={wid}
          height={hei}
          ref={this.canvRef}
        ></canvas>
      </>
    );
  }
  render() {
    return (
      <>
        <div
          ref={e => (this.container = e!)}
          style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto' }}
        >
          {this.state.dimms && this.renderContent()}
        </div>
        <button onClick={e => this.onKeyPress({ key: 'h' } as any)}>
          seeRawText
        </button>
      </>
    );
  }
}
