import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'

import Loader from './Loader'


const Flagged = () => {

  const [flaggedPubs, updateFlaggedPubs] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {

    async function fetchData() {

      const { data } = await axios.get('/api/pubs/flagged/comments/pubs')
      // const { data: data2 } = await axios.get('/api/pubs/flagged/replies/pubs')
      updateFlaggedPubs(data)
      console.log(data)
      // updateFlaggedPubs(data.concat(data2))
      // console.log(data.concat(data2))
      // console.log(data[0])
    }
    fetchData()
  }, [])


  function countFlaggedComments(pub) {
    let flaggedComments = 0
    pub.comments.forEach(comment => {
      if (comment.flagged === true) {
        flaggedComments += 1
      }
    })
    return [flaggedComments, pub.comments.length]
  }


  function countReplies(comment) {
    const replies = comment.replies.length
    if (replies === 0) {
      return '0 Replies'
    } else if (replies === 1) {
      return '1 Reply'
    } else {
      return `${replies} Replies`
    }
  }

  if (flaggedPubs === undefined) {
    return <>
      <Loader />
    </>
  }


  return <>
    <div className="search-results">
      <div className="columns is-multiline is-mobile">
        {flaggedPubs.map((pub, index) => {
          return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
            <Link to={`${pub._id}`}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-square">
                    <img src={pub.imageUrl} alt={pub.name} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media-content">
                    <h2 className="title is-5">{pub.name}</h2>
                    <p className="subtitle is-6">{pub.address.address1}, {pub.address.zip_code}</p>
                    <p>{countFlaggedComments(pub)[1] > 1 ? countFlaggedComments(pub)[1] + ' Comments' : countFlaggedComments(pub)[1] + ' Comment'}</p>
                    <p>{countFlaggedComments(pub)[0]} Flagged</p>
                  </div>
                </div>
              </div>
            </Link>
            {pub.comments.map((comment, index) => {
              if (comment.flagged === true) {
                return <div className="flagged" key={index} >
                  <Link to={`/pubs/${pub._id}/comments/${comment._id}`}>
                    <article className="media">
                      <div className="media-content">
                        <div className="content">
                          <div className="user-time">
                            <p className="username">
                              {comment.user.username}
                            </p>
                            <p>
                              ({moment(comment.createdAt).fromNow()})
                            </p>
                          </div>
                          <p>{comment.text}</p>
                          <div>
                            {countReplies(comment)}
                          </div>
                        </div>
                      </div>
                      <div className="media-right">
                        {/* {!isCreator(comment.user._id, user)  */}
                        <Icon
                          path={mdiFlagVariant}
                          size={1}
                          color={comment.flagged === true ? 'red' : 'grey'}
                        />
                      </div>
                    </article>
                  </Link>
                </div>
              }
            })}
          </div>
        })}
      </div>
    </div>
  </>
}


export default Flagged