import Ajv, {JTDParser, JTDSchemaType} from 'ajv/dist/jtd'
import {InvalidCommitBodyError} from './errors'
import {Message} from './message'

interface CommitBodyMetaData {
  job_number?: number
  job_commit?: string
}

interface CommitBodyData {
  namespace: 'git-queue.commit-body'
  version: number
  metadata: CommitBodyMetaData
  payload: string
}

const CommitBodySchema: JTDSchemaType<CommitBodyData> = {
  properties: {
    namespace: {enum: ['git-queue.commit-body']},
    version: {type: 'int32'},
    payload: {type: 'string'},
    metadata: {
      optionalProperties: {
        job_number: {type: 'int32'},
        job_commit: {type: 'string'}
      },
      additionalProperties: true
    }
  },
  additionalProperties: true
}

export class CommitBody {
  body: CommitBodyData
  private static parse: JTDParser<CommitBodyData> = new Ajv().compileParser(
    CommitBodySchema
  )

  constructor(text: string) {
    this.body = this.getParsedBodyData(text)
  }

  static fromMessage(message: Message): CommitBody {
    return new CommitBody(
      JSON.stringify({
        namespace: 'git-queue.commit-body',
        version: 1,
        metadata: {
          job_commit: message.getJobRef().getHash()
        },
        payload: message.getPayload()
      })
    )
  }

  getParsedBodyData(text): CommitBodyData {
    const parsedBody = CommitBody.parse(text)
    if (this.isCommitBodyData(parsedBody)) {
      return parsedBody
    } else {
      throw new InvalidCommitBodyError(text)
    }
  }

  isCommitBodyData(
    object: CommitBodyData | undefined
  ): object is CommitBodyData {
    return typeof object != 'undefined'
  }

  toString(): string {
    return JSON.stringify(this.body)
  }

  getPayload(): string {
    return this.body?.payload
  }

  metadataEqualsTo(other: CommitBody): boolean {
    return (
      this.body.metadata.job_commit === other.body.metadata.job_commit &&
      this.body.metadata.job_number === other.body.metadata.job_number
    )
  }

  equalsTo(other: CommitBody): boolean {
    return (
      this.body.namespace === other.body.namespace &&
      this.body.version === other.body.version &&
      this.body.payload === other.body.payload &&
      this.metadataEqualsTo(other)
    )
  }
}
