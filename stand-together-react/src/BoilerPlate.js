import React from 'react'
import TopicItem from './topicitem'
import { connect } from 'react-redux'
import { addDiscussionItem, fetchSuccess } from './actions/actions'

const mapStateToProps = (state) => {
  return {
    topics: state.topics,
    items: state.itemByTopic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddItem: (topic, name, title, details, id) => {
      const action = addDiscussionItem(topic, name, title, details)
      fetch(`/api/standup/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(action)
      })
      dispatch(action)
    },
    fetchResponse: (response) => {
      dispatch(fetchSuccess(response))
    }
  }
}

const fetchPosts = (id) => {
  return fetch(`/api/standup/${id}`).then((r) => {
    return r.json()
  })
}

class BP extends React.Component {
  componentDidMount () {
    const { match, fetchResponse } = this.props
    fetchPosts(match.params.id).then((response) => {
      fetchResponse(response)
    })
  }
  render () {
    const { match, topics, items, onAddItem } = this.props
    return (
      <div>
        <div className='homeNavBar'>
          <h2>Stand Together</h2>
          <p id='p1'>http/localhost:5000/standup/{match.params.id}</p>
          <button className='button right'>Copy Link</button>
        </div>
        <div className='flexRow'>
          {/* <div className='container'> */}
          {topics.map((topic, i) => {
            const currentItems = items[topic]
            return <TopicItem title={topic} key={i}
              items={currentItems}
              addAnItem={(topic, name, title, details) => onAddItem(topic, name, title, details, match.params.id)} />
          })}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BP)
