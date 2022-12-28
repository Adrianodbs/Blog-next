import React from 'react'
import { Text } from 'thon-ui'
import { Post } from '../src/domains/posts/models/post'
import { format } from 'date-fns'

const baseURL = 'https://www.tabnews.com.br/api/v1'
const postsEndpoint = '/contents/guscsales'

async function getLastPost() {
  const postsResponse = await fetch(`${baseURL}${postsEndpoint}`)

  let posts = (await postsResponse.json()) as Post[]

  posts = posts
    .filter(post => post.title)
    .map(post => ({
      ...post,
      created_at: new Date(post.created_at)
    }))

  posts.sort(
    (a, b) =>
      (b.created_at as unknown as number) - (a.created_at as unknown as number)
  )

  const [lastPostFromList] = posts

  const lastPostsResponse = await fetch(
    `${baseURL}${postsEndpoint}/${lastPostFromList.slug}`
  )

  const lastPost = (await lastPostsResponse.json()) as Post

  console.log(lastPost)

  if (lastPost) {
    return { ...lastPost, created_at: new Date(lastPost.created_at) }
  }

  return null
}

export default async function Home() {
  const lastPost = await getLastPost()

  if (!lastPost) {
    return null
  }

  return (
    <article>
      <Text variant="sm" className="text-gray-500">
        {format(lastPost?.created_at, 'dd.MM.yyyy')} - Última Postagem...
      </Text>
      <Text
        as="h1"
        variant="2xl lg:3xl"
        className="w-full lg:w-[35rem] mt-2 mb-12"
      >
        {lastPost.title}
      </Text>
    </article>
  )
}
