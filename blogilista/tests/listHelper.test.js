const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const blogs = helper.listWithBlogs
    const listWithOneBlog = helper.listWithOneBlog

    test('of empty list is zero', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    test('of bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favorite', () => {
    const blogs = helper.listWithBlogs
    const listWithOneBlog = helper.listWithOneBlog

    test('of empty list is none', () => {
        const blogs = []
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(null)
    })
    test('when list has only one blog, it is the favorite', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })
    test('of bigger list is chosen right', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
})

describe('Author with most blogs', () => {
    const blogs = helper.listWithBlogs
    const listWithOneBlog = helper.listWithOneBlog

    test('of empty list is none', () => {
        const blogs = []
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(null)
    })
    test('when list has only one blog, is the only one', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({ author:listWithOneBlog[0].author, blogs:1 })
    })
    test('of bigger list is chosen right', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author:'Robert C. Martin', blogs:3 })
    })
})

describe('Author with most likes', () => {
    const blogs = helper.listWithBlogs
    const listWithOneBlog = helper.listWithOneBlog

    test('of empty list is none', () => {
        const blogs = []
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(null)
    })
    test('when list has only one blog, is the only one', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({ author:listWithOneBlog[0].author, likes:5 })
    })
    test('of bigger list is chosen right', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author:'Edsger W. Dijkstra', likes:17 })
    })
})