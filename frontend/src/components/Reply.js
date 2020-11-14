import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'
import { setRTLTextPlugin } from 'mapbox-gl'
import { Link } from 'react-router-dom'








const Reply = (props) => {

  const token = localStorage.getItem('token')
  const [comment, updateComment] = useState({})
  const [text, setText] = useState('')

  const id = props.match.params.id
  const commentId = props.match.params.commentId



  useEffect(() => {
    axios.get(`/api/pub/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateComment(resp.data)
        console.log(resp.data)
      })
  }, [])



  function handleReply() {
    if (setText === '') {
      return
    } else {
      axios.post(`/api/pub/${id}/comments/${commentId}/new-reply`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(resp => {
          setText('')
          updateComment(resp.data)
        })
    }
  }






  if (comment.text === undefined) {
    return <></>
  }

  return <>
    <div className="reply-page">
      <div className="comment-section">
        <div className="current-comment">
          <div>{comment.text}</div>
          <div>{comment.user.username}</div>
          <div>({moment(comment.createdAt).fromNow()})</div>
          <div>
            <Link to={`/pubs/${id}`}>Back</Link>
          </div>
        </div>
        <div className="replies-section">
          <article className="media">
            {token && <div className="media-content">
              <div className="field">
                <p className="control">
                  <textarea className="textarea" placeholder="Post a reply..." onChange={event => setText(event.target.value)} value={text}>{text}</textarea>

                </p>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-info" onClick={handleReply}>Post</button>
                </p>
              </div>
            </div>}
          </article>
          {comment.replies && comment.replies.map(reply => {
            return <article key={reply._id} className="media">
              <div className="media-content">
                <div className="content">
                  <div className="user-time">
                    <p className="username">
                      {reply.user.username}
                    </p>
                    <p>
                      ({moment(reply.createdAt).fromNow()})
                    </p>
                  </div>
                  <p>{reply.text}</p>

                </div>
              </div>
            </article>
          })}

        </div>
      </div>
    </div>
  </>

}

export default Reply