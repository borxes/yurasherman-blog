import React from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import './style.scss'

export default class TagsBlock extends React.Component {
  render() {
    const posts = this.props.posts.edges
    const tagsPerPost = posts.map(post => post.node.frontmatter.tags)
    const tagsCount = {}
    tagsPerPost.forEach(postTags => postTags.forEach(tag => {
      // let's make eslint happy
      if (Object.prototype.hasOwnProperty.call(tagsCount, tag)) tagsCount[tag] += 1
      else tagsCount[tag] = 1
    }))

    // const tags = categories.map(category => (category[0]))

    //     {JSON.stringify(posts.map(post => post.node.fields.slug))}

    return (
      <div>
        <div className="tagsBlock-title">
          Topics
        </div>
        <ul className="tagsBlock__list">
          {Object.keys(tagsCount).map(tag => (
            <li key={tag} className="tagsBlock__list-item">
              <Link
                to={`/tags/${kebabCase(tag)}/`}
                className="tagsBlock__list-item-link"
              >
                {tag} ({tagsCount[tag]})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
