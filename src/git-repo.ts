import {CommitResult, DefaultLogFields, LogResult, SimpleGit} from 'simple-git'
import {CommitMessage} from './commit-message'
import {CommitOptions} from './commit-options'
import {GitDirNotInitializedError} from './errors'
import {GitRepoDir} from './git-repo-dir'
import {execFileSync} from 'child_process'

export class GitRepo {
  private readonly dir: GitRepoDir
  private readonly git: SimpleGit

  constructor(dir: GitRepoDir, git: SimpleGit) {
    this.dir = dir
    this.git = git
  }

  isInitialized(): boolean {
    try {
      const cmd = `git`
      const args = ['-C', this.getDirPath(), 'status']
      execFileSync(cmd, args, {stdio: 'ignore'})
    } catch {
      return false
    }
    return true
  }

  getDir(): GitRepoDir {
    return this.dir
  }

  getDirPath(): string {
    return this.dir.getDirPath()
  }

  async init(): Promise<void> {
    await this.git.init()
  }

  env(name: string, value: string): void {
    this.git.env(name, value)
  }

  async getCurrentBranch(): Promise<string | null> {
    const status = await this.git.status()
    return status.current
  }

  async log(): Promise<LogResult<DefaultLogFields>> {
    return await this.git.log()
  }

  async hasCommits(): Promise<boolean> {
    if (!this.isInitialized()) {
      throw new GitDirNotInitializedError(this.dir.getDirPath())
    }
    try {
      const cmd = `git`
      const args = ['-C', this.getDirPath(), 'log', '-n', '0']
      execFileSync(cmd, args, {stdio: 'ignore'})
    } catch (err) {
      // No commits yet
      return false
    }
    return true
  }

  async commit(
    commitMessage: CommitMessage,
    commitOptions: CommitOptions
  ): Promise<CommitResult> {
    // TODO: Code Review. Should we use our own CommitResult class?
    // We could return always the 40-character commit hash with:
    // const longCommit = await git.show([commit, '--pretty=%H', '-s']);
    // Related issue: https://github.com/steveukx/git-js/issues/757
    return await this.git.commit(
      commitMessage.forSimpleGit(),
      commitOptions.forSimpleGit()
    )
  }
}
