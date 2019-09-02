import React from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'

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
        <ul>
          {Object.keys(tagsCount).map(tag => (
            <li key={tag}>
              <Link
                to={`/tags/${kebabCase(tag)}/`}
                className="tags__list-item-link"
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
