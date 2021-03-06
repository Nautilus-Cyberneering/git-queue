import {CommitBody} from './commit-body'
import {CommitSubject} from './commit-subject'
import {CommitSubjectParser} from './commit-subject-parser'

export class CommitMessage {
  subject: CommitSubject
  body: CommitBody

  constructor(subject: CommitSubject, body: CommitBody) {
    this.subject = subject
    this.body = body
  }

  static fromText(subject: string, body: string): CommitMessage {
    return new CommitMessage(
      CommitSubjectParser.parseText(subject),
      new CommitBody(body)
    )
  }

  equalsTo(other: CommitMessage): boolean {
    return (
      this.subject.equalsTo(other.subject) && this.body.equalsTo(other.body)
    )
  }

  forSimpleGit(): string[] {
    return [this.subject.toString(), this.body.toString()]
  }
}
