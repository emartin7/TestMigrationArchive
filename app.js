const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.PERSONAL_TOKEN,
  baseUrl: "https://api.github.com",
});

const execute = async () => {
  org = process.env.ORG;
  try {
    migrationResponse = await octokit.request(`GET /orgs/${org}/migrations`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!migrationResponse) {
      repositoryResponse = await octokit.request(`GET /orgs/${org}/repos`, {
        org: org,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      repos = repositoryResponse.data.map((repos) => repos.name);

      await octokit.request(`POST /orgs/${org}/migrations`, {
        org: org,
        lock_repositories: false,
        repositories: repos,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      migrationResponse = await octokit.request(`GET /orgs/${org}/migrations`, {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    }

    migrationId = migrationResponse.data[0].id;

    migrationArchiveURL = await octokit.request(
      `GET /orgs/${org}/migrations/${migrationId}/archive`,
      {
        org: org,
        migration_id: migrationId,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log(migrationArchiveURL);
  } catch (error) {
    console.error(error);
  }
};

execute();
