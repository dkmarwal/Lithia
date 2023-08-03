import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { Suspense } from "react";
import "~/lib/interceptor";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from '~/App';
import store from "~/redux";
import ThemeWrapperComponent from '~/ThemeWrapperComponent'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <ThemeWrapperComponent> 
      <Suspense fallback="loading">
         <App />
      </Suspense>
    </ThemeWrapperComponent>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);