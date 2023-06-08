const _ = require('lodash')


const dummy = () => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce(((total, num) => total + num), 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogCounts = _.countBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(_.keys(blogCounts), (author) => blogCounts[author])
    const mostBlogsCount = blogCounts[authorWithMostBlogs]

    return {
        author: authorWithMostBlogs,
        blogs: mostBlogsCount
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const authors = _.groupBy(blogs, 'author')
    const likesByAuthor = _.mapValues(authors, (blogs) => _.sumBy(blogs, 'likes'))
    const authorWithMostLikes = _.maxBy(_.keys(likesByAuthor), (author) => likesByAuthor[author])
    const mostLikesCount = likesByAuthor[authorWithMostLikes]

    return {
        author: authorWithMostLikes,
        likes: mostLikesCount
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }