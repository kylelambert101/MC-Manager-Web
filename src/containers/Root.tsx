import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { hot } from "react-hot-loader/root";
import { History } from "history";
import { ToastProvider } from "react-toast-notifications";
import { Store } from "../store";
import Routes from "../Routes";

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ToastProvider autoDismiss autoDismissTimeout={2000}>
        <Routes />
      </ToastProvider>
      p
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
