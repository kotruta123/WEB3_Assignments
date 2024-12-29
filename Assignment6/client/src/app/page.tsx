"use client";

import Lobby from "@/components/Lobby";
import { Provider } from "react-redux";
import { store } from "@/stores/store";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="max-w-screen-2xl mx-auto bg-slate-800 h-screen">
        <div className="bg-white">
          <Nav>
            <Lobby />;
          </Nav>
        </div>
      </div>
    </Provider>
  );
}
