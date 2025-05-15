#!/bin/sh
echo "Setting up .env files to be skipped by Git..."

git update-index --skip-worktree .env
git update-index --skip-worktree .env.development
git update-index --skip-worktree .env.stage
git update-index --skip-worktree .env.production
git update-index --skip-worktree .env.test