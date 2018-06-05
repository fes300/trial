import * as React from "react";

interface AppProps { count: number; increase: (_event: any) => void; }

export class App extends React.Component<AppProps, {}> {
  render() {
    const { count, increase } = this.props

    return (
      <React.Fragment>
        <h1>Hello the count is {count}</h1>
        <button onClick={increase}>+1</button>
      </React.Fragment>      
    );
  }
}
