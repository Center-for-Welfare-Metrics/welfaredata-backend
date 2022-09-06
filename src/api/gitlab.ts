import axios from "axios";

const GITLAB_BASE_URL = "https://gitlab.com/api/v4";
import querystring from "querystring";

interface IIssueData {
  title: string;
  description: string;
}

export const addIssue = (issueData: any) => {
  const { title, description } = issueData;
  const fullUrl = `${GITLAB_BASE_URL}/projects/${
    process.env.GITLAB_PROJECT_ID
  }/issues?${querystring.stringify({
    title,
    description,
    labels: "user-feedback",
  })}`;
  return axios.post(
    fullUrl,
    {},
    {
      headers: {
        "PRIVATE-TOKEN": process.env.GITLAB_PERSONAL_TOKEN as string,
      },
    }
  );
};
