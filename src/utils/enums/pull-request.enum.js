const pullRequestStatusEnum = {
    0: 'not set',
    1: 'active',
    2: 'abandoned',
    3: 'completed'
};

const pullRequestMergeStatusEnum = {
    0: 'not set',
    1: 'queued',
    2: 'conflicts',
    3: 'succeeded',
    4: 'rejected by policy',
    5: 'Failure'
}

module.exports = { 
    pullRequestStatusEnum,
    pullRequestMergeStatusEnum
}
