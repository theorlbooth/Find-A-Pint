import React, { useState, useEffect, useRef, createRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'
import { Link } from 'react-router-dom'

import Loader from './Loader'
import { getUserId, isCreator, isUser } from '../lib/auth'



const Reply = (props) => {

  const token = localStorage.getItem('token')
  const [comment, updateComment] = useState({})
  const [text, setText] = useState('')
  const [user, updateUser] = useState({})
  const [pub, updatePub] = useState({})

  const id = props.match.params.id
  const commentId = props.match.params.commentId

  let scrollRef = useRef()


  useEffect(() => {
    axios.get(`/api/users/${getUserId()}`)
      .then(resp => {
        updateUser(resp.data)
        console.log(resp.data)
      })

    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updatePub(resp.data)
        console.log(resp.data)
      })

    axios.get(`/api/pub/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateComment(resp.data)
        console.log(resp.data)
      })

  }, [])



  function handleReply() {
    if (text === '') {
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


  function handleReplyDelete(replyId) {
    axios.delete(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateComment(resp.data)
      })
  }

  function handleCommentDelete(commentId) {
    axios.delete(`/api/pub/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        props.history.push(`/pubs/${id}`)
      })
  }

  function handleCFlag(commentId) {
    axios.get(`/api/pub/${id}/comments/${commentId}`)
      .then(resp => {
        if (resp.data.flagged === false) {
          axios.put(`/api/pubs/${id}/comments/${commentId}`, { flagged: true }, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(resp => {
              updateComment(resp.data)
              console.log(resp.data)
            })
        } else if (resp.data.flagged === true) {
          axios.put(`/api/pubs/${id}/comments/${commentId}`, { flagged: false }, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(resp => {
              updateComment(resp.data)
              console.log(resp.data)
            })
        }
      })
  }

  function handleFlag(replyId) {
    axios.get(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`)
      .then(resp => {
        if (resp.data.flagged === false) {
          axios.put(`/api/pub/${id}/comments/${commentId}`, { flagged: true }, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(resp => {
              axios.put(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, { flagged: true }, {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(resp => {
                  updateComment(resp.data)
                  console.log(resp.data)
                })
            })
        } else if (resp.data.flagged === true) {
          const flaggedReplies = comment.replies.filter(reply => {
            if (reply.flagged === true) {
              console.log(reply)
              return reply
            }
          })
          if (flaggedReplies.length - 1 === 0) {
            axios.put(`/api/pub/${id}/comments/${commentId}`, { flagged: false }, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(resp => {
                axios.put(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, { flagged: false }, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                  .then(resp => {
                    updateComment(resp.data)
                    console.log(resp.data)
                  })
              })
          } else {
            axios.put(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, { flagged: false }, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(resp => {
                updateComment(resp.data)
              })
          }
        }
      })
  }


  if (comment.text === undefined) {
    return <>
      <Loader />
    </>
  }


  const handleClick = () => {
    console.log(scrollRef.current)
    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
  }

  function handlePost() {
    handleReply()
    setTimeout(() => {
      handleClick()
    }, 100)
  }


  return <>
    <div className="reply-page">
      <div className="comments-section">
        <article className="media c-comment">
          <div className="media-content">
            <div className="content">
              <div className="current-comment"></div>
              <p>{comment.text}</p>
              <p style={{ textDecoration: 'underline' }} className="together">{comment.user.username}</p>
              <p style={{ fontWeight: 'normal' }} className="together">({moment(comment.createdAt).fromNow()})</p>
            </div>
            <div className="button-flex-2">
              <Link to={`/pubs/${id}`}><button className="button is-black is-inverted is-outlined" style={{ border: '3px solid white' }}>Back</button></Link>
            </div>
          </div>
          <div className="media-right">
            {isUser(pub.user, user) && <Icon onClick={() => handleCFlag(comment._id)} path={mdiFlagVariant}
              size={1}
              color={comment.flagged === true ? 'red' : 'grey'} />}
            {isCreator(comment.user._id, user) && <button className="delete" onClick={() => handleCommentDelete(comment._id)}></button>}
          </div>
        </article>
        <div className="replies-section">
          <div className="button-flex">
            <button
              onClick={() => handleClick()} className="button is-black" style={{ border: '3px solid white' }} >Scroll to bottom</button>
          </div>
          <div className="replies-shown">
            {comment.replies && comment.replies.map((reply, i, arr) => {
              return <article id={arr.length - 1 === i ? 'anchor' : ''} ref={scrollRef} key={reply._id} className="media">
                <div className="media-content">
                  <div className="content">
                    <div className="user-time">
                      <p className="username">
                        {reply.user.username}
                      </p>
                      <p style={{ fontWeight: 'normal' }} >
                        ({moment(reply.createdAt).fromNow()})
                      </p>
                    </div>
                    <p>{reply.text}</p>
                  </div>
                </div>
                <div className="media-right">
                  {isUser(pub.user, user) && <Icon onClick={() => handleFlag(reply._id)} path={mdiFlagVariant}
                    size={1}
                    color={reply.flagged === true ? 'red' : 'grey'} />}
                  {isCreator(reply.user._id, user) && <button className="delete" onClick={() => handleReplyDelete(reply._id)}></button>}
                </div>
              </article>
            })}
          </div>
          <div className="add-reply">
            <article className="media">
              {token && <div className="media-content">
                <div className="field">
                  <p className="control">
                    <textarea className="textarea" placeholder="Post a reply..." onChange={event => setText(event.target.value)} value={text}>{text}</textarea>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <button className="button is-black" style={{ border: '3px solid white' }} onClick={handlePost}>Post</button>
                  </p>
                </div>
              </div>}
            </article>
          </div>
        </div>
      </div>
    </div>
  </>

}

export default Reply