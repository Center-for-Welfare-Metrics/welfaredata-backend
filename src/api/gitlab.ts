const axios = require('axios')

const GITLAB_BASE_URL = 'https://gitlab.com/api/v4'
const querystring = require('querystring')


interface IIssueData {
    title:string
    description:string
}


export const addIssue = (issueData:IIssueData) => {
    
    const { title,description } = issueData

    const fullUrl = `${GITLAB_BASE_URL}/projects/${process.env.GITLAB_PROJECT_ID}/issues?${querystring.stringify({ title, description, labels: 'user-reported' })}`
    return axios.post(fullUrl, {},
        {
            headers: {
                'PRIVATE-TOKEN': process.env.GITLAB_PERSONAL_TOKEN
            }
        }
    )

}

