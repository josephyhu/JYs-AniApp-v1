import React, {useContext, useState} from 'react';
import {myContext} from '../../Context';

export default function Homepage() {
  const userId = useContext(myContext)
  const url = 'https://graphql.anilist.co';
  const [html, setHTML] = useState();
  const handleSubmit = (e, userId) => {
    e.preventDefault();
      let query = `
      query ($userId: Int, $page: Int, $perPage: Int, $status: MediaListStatus) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            currentPage,
            lastPage
          },
          mediaList (userId: $userId, type: ANIME, status: $status)  {
            media {
              id,
              title {
                romaji,
              },
              coverImage {
                large
              }
            },
            progress,
            score
            }
          }
      }`
      let variables = {
        userId: userId,
        page: e.target.page.value,
        perPage: 10,
        status: e.target.status.value
      }
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        }),
      })
        .then(res => res.json())
        .then(data => {
          let html = '';
          html += `<h2>${e.target.status.value}</h2><table><thead><tr><th>Cover</th><th>Anime</th><th>Progress</th><th>Score</th></tr></thead><tbody>`
          for (let i = 0; i < data.data.Page.mediaList.length; i++) {
            html += `<tr><td><img src=${data.data.Page.mediaList[i].media.coverImage.large} alt="cover"></td>
                      <td><a href="https://anilist.co/anime/${data.data.Page.mediaList[i].media.id}" target="_blank">${data.data.Page.mediaList[i].media.title.romaji}</a></td>
                      <td>${data.data.Page.mediaList[i].progress}</td>
                      <td>${data.data.Page.mediaList[i].score}</td></tr>`;
          }
          html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
          setHTML(html)
        })
    }
  return (
    <div>
      <h1>Anime List</h1>
      <form onSubmit={event => handleSubmit(event, userId)}>
        <label htmlFor="status">Status&nbsp;</label>
        <select id="status" name="status">
          <option value="CURRENT">Currently watching</option>
          <option value="COMPLETED">Completed</option>
          <option value="PLANNING">Planning</option>
          <option value="PAUSED">Paused</option>
          <option value="DROPPED">Dropped</option>
        </select>
        <label htmlFor="page">Page #&nbsp;</label>
        <input type="number" id="page" name="page" defaultValue="1" />
        <input type="hidden" value={userId} />
        <button type="submit">View your anime/manga list.</button>
      </form>
      <section dangerouslySetInnerHTML={{__html: html}}></section>
    </div>
  )
}