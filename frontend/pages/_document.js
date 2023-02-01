import Document, { Html, Head, Main, NextScript } from "next/document";
import "../styles/style.less";
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
