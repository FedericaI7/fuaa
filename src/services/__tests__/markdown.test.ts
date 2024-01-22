import { readFileSync, readdirSync } from 'fs'
import { PostDataService } from '@/services/abstract'
import { MarkdownService } from '@/services/markdown'
import { postContent } from '@/services/__tests__/post'

jest.mock('fs')

describe('MarkdownService', () => {
  let service: PostDataService

  beforeEach(() => {
    service = new MarkdownService('./posts/')
  })

  describe('getPostBySlug', () => {
    beforeEach(() => {
      ;(<jest.Mock>readFileSync).mockReturnValue(postContent)
    })

    it('returns a well formatted post', () => {
      expect(service.getPostBySlug('post')).resolves.toEqual({
        id: new Date('2024-03-16T05:35:07.322Z').valueOf(),
        author: 'Angelo Gulina',
        content: 'The content of a mocked post',
        date: new Date('2024-03-16T05:35:07.322Z'),
        description: undefined,
        excerpt: 'The excerpt of a mocked post',
        slug: 'post',
        title: 'The title of a mocked post',
        url: undefined,
      })
    })

    it('calls `readFileSync` with the correct arguments', () => {
      service.getPostBySlug('post')

      expect(readFileSync).toHaveBeenCalledWith('posts/post.md', 'utf8')
    })
  })

  describe('getAvailablePosts', () => {
    beforeEach(() => {
      ;(<jest.Mock>readFileSync).mockReturnValue(postContent)
    })

    it('calls `readdirSync` with the correct arguments', () => {
      service.getAvailablePosts()

      expect(readdirSync).toHaveBeenCalledWith('./posts/')
    })

    it('returns the correct paths', () => {
      ;(<jest.Mock>readdirSync).mockReturnValue(['file.md'])

      expect(service.getAvailablePosts()).resolves.toEqual([
        {
          author: 'Angelo Gulina',
          content: 'The content of a mocked post',
          date: new Date('2024-03-16T05:35:07.322Z'),
          description: undefined,
          excerpt: 'The excerpt of a mocked post',
          id: new Date('2024-03-16T05:35:07.322Z').valueOf(),
          slug: 'file',
          title: 'The title of a mocked post',
          url: undefined,
        },
      ])
    })

    it('correctly excludes non `.md` files', () => {
      ;(<jest.Mock>readdirSync).mockReturnValue(['file.md', 'file.md.ts'])

      expect(service.getAvailablePosts()).resolves.toEqual([
        {
          author: 'Angelo Gulina',
          content: 'The content of a mocked post',
          date: new Date('2024-03-16T05:35:07.322Z'),
          description: undefined,
          excerpt: 'The excerpt of a mocked post',
          id: new Date('2024-03-16T05:35:07.322Z').valueOf(),
          slug: 'file',
          title: 'The title of a mocked post',
          url: undefined,
        },
      ])
    })
  })
})
