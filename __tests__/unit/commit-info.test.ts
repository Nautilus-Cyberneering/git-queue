import {CommitHash} from '../../src/commit-hash'
import {CommitInfo} from '../../src/commit-info'

describe('CommitInfo', () => {
  it('should have basic commit info', () => {
    const commitInfo = new CommitInfo(
      new CommitHash('ad5cea6308f69d7955d8de5f0da19f675d5ba75f'),
      'date',
      'message',
      'refs',
      'body',
      'author name',
      'author email'
    )

    expect(
      commitInfo.hash.equalsTo(
        new CommitHash('ad5cea6308f69d7955d8de5f0da19f675d5ba75f')
      )
    ).toBe(true)
    expect(commitInfo.date).toBe('date')
    expect(commitInfo.message).toBe('message')
    expect(commitInfo.refs).toBe('refs')
    expect(commitInfo.body).toBe('body')
    expect(commitInfo.authorName).toBe('author name')
    expect(commitInfo.authorEmail).toBe('author email')
  })

  it('should be instantiated from the simple-git class DefaultLogFields', () => {
    const commitInfo = CommitInfo.fromDefaultLogFields({
      hash: 'ad5cea6308f69d7955d8de5f0da19f675d5ba75f',
      date: 'date',
      message: 'message',
      refs: 'refs',
      body: 'body',
      author_name: 'author name',
      author_email: 'author email'
    })

    expect(commitInfo).toBeInstanceOf(CommitInfo)
  })
})
