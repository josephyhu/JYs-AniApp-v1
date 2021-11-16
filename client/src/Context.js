import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';

export const myContext = createContext({});
export default function Context(props) {
  const [userId, setUserId] = useState();
  const url = 'https://graphql.anilist.co';

  useEffect(() => {
    axios.get("https://jys-aniapp-v1-server.herokuapp.com/gettoken", {withCredentials: true}).then((res) => {
      if (res.data) {
        let query = `
          query {
            Viewer {
              id
            }
          }`
        fetch(url, {
          method: "POST",
          headers: {
            "authorization": "Bearer " + res.data,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            query: query
          }),
        })
          .then(res => res.json())
          .then(data => setUserId(data.data.Viewer.id))
        }
      })
  }, [])
  return (
    <myContext.Provider value={userId}>{props.children}</myContext.Provider>
  )
}