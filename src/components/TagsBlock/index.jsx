import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import './style.scss'

export default () =>
  (
    <StaticQuery
      query={graphql`
        query TagsBlockQuery {
          allMarkdownRemark(
            limit: 2000
            filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
          ) {
              group(field: frontmatter___tags) {
                fieldValue
                totalCount
              }
            }
        }
      `}
      render={data => (
        <div>
          <div className="tagsBlock-title">
            Topics
          </div>
          <ul className="tagsBlock__list">
            {data.allMarkdownRemark.group.map(tagRecord => (
              <li key={tagRecord.fieldValue} className="tagsBlock__list-item">
                <Link
                  to={`/tags/${kebabCase(tagRecord.fieldValue)}/`}
                  className="tagsBlock__list-item-link"
                >
                  {tagRecord.fieldValue} ({tagRecord.totalCount})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )
      }
    />
  )

