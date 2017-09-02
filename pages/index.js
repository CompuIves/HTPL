import React from 'react';
import styled from 'styled-components';

import parseHTML from '../utils/convert-html';

const Container = styled.div`
  display: flex;
  font-family: sans-serif;
  justify-content: center;
  text-align: center;

  flex-direction: column;

  h1 {
    margin-bottom: 1rem;
    color: red;
  }
`;

const TextAreas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  textarea {
    font-family: Consolas, Menlo, monospace;
    font-size: 1.5rem;
    flex: 1;
    height: 800px;
  }
`;

const DEFAULT_CODE = `<html>
<head>
</head>
<body>
  <var name="a">20</var>
  <var name="b">20</var>

  <var name="c">
    <sum>
      <var name="a"></var>
      <var name="b"></var>
      30
    </sum>
  </var>

  <max>
    30
    <sum>
      20
      <var name="c"></var>
    </sum>
  </max>
</body>

</html>`;

export default class Index extends React.PureComponent {
  state = {
    code: DEFAULT_CODE,

    compiledCode: parseHTML(DEFAULT_CODE),
  };

  onChange = e => {
    this.setState({
      code: e.target.value,
      compiledCode: parseHTML(e.target.value),
    });
  };

  render() {
    return (
      <Container>
        <h1>HTPL</h1>
        <h2>It's the best</h2>

        <TextAreas>
          <textarea value={this.state.code} onChange={this.onChange} />
          <textarea value={this.state.compiledCode} readOnly />
        </TextAreas>
      </Container>
    );
  }
}
