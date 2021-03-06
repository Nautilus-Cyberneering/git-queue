import {CommitHash} from '../../src/commit-hash'
import {CommitInfo} from '../../src/commit-info'
import {Job, JobState, nullJob} from '../../src/job'
import {JobId} from '../../src/job-id'
import {NewJobCommittedMessage} from '../../src/committed-message'
import {dummyCommitBodyText} from '../../src/__tests__/helpers'

describe('Job', () => {
  it('should contain a payload', () => {
    const job = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(1)
    )

    expect(job.getPayload()).toBe('payload')
  })

  it('should contain a commit hash where the job was created', () => {
    const commitHash = new CommitHash(
      'a362802b98c78df052a78796a1a7cde60a5c1faf'
    )
    const job = new Job('payload', commitHash, new JobId(1))

    expect(job.getCommitHash()).toBe(commitHash)
  })

  it('should contain a Job Id', () => {
    const job = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(42)
    )

    const expectedJobId = new JobId(42)

    expect(job.getJobId().equalsTo(expectedJobId)).toBe(true)
  })

  it('should be nullable', () => {
    const job = nullJob()

    expect(job.isNull()).toBe(true)
  })

  it('should compare two jobs', () => {
    const job1 = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0)
    )

    const job2 = new Job(
      'payload',
      new CommitHash('8f51fa0a019b277103acc5ef75c52dfb2a9bcce3'),
      new JobId(0)
    )

    const job3 = new Job(
      'payload3',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0)
    )

    expect(job1.equalsTo(job1)).toBe(true)
    expect(job1.equalsTo(job2)).toBe(false)
    expect(job1.equalsTo(job3)).toBe(false)
  })

  it('should be instantiable from a new job committed message', () => {
    const commitInfo = new CommitInfo(
      new CommitHash('ad5cea6308f69d7955d8de5f0da19f675d5ba75f'),
      'date',
      '📝🈺: queue-name: job.id.1 job.ref.f1a69d48a01cc130a64aeac5eaf762e4ba685de7',
      'refs',
      dummyCommitBodyText(),
      'author name',
      'author email'
    )

    const newJobCommittedMessage = new NewJobCommittedMessage(commitInfo)

    const job = Job.fromNewJobCommittedMessage(newJobCommittedMessage)

    expect(job.getPayload()).toBe('test')
    expect(
      job
        .getCommitHash()
        .equalsTo(new CommitHash('ad5cea6308f69d7955d8de5f0da19f675d5ba75f'))
    ).toBe(true)
  })

  it('should have a "new" state when the job is still pending to process (default state)', () => {
    const job = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0),
      JobState.New
    )

    expect(job.isNew()).toBe(true)

    const jobWithDefaultState = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0)
    )

    expect(jobWithDefaultState.isNew()).toBe(true)
  })

  it('should have a "started" state when the job processing has already started', () => {
    const job = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0),
      JobState.Started
    )

    expect(job.isStarted()).toBe(true)
  })

  it('should have a "finished" state when the job processing has already finished', () => {
    const job = new Job(
      'payload',
      new CommitHash('a362802b98c78df052a78796a1a7cde60a5c1faf'),
      new JobId(0),
      JobState.Finished
    )

    expect(job.isFinished()).toBe(true)
  })
})
