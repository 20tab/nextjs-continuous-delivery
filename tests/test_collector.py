"""Project bootstrap tests."""

from contextlib import contextmanager
from io import StringIO
from pathlib import Path
from unittest import TestCase, mock

from bootstrap.collector import (
    clean_deployment_type,
    clean_environment_distribution,
    clean_gitlab_group_data,
    clean_project_dirname,
    clean_project_slug,
    clean_sentry_dsn,
    clean_sentry_org,
    clean_service_dir,
    clean_service_slug,
    clean_terraform_backend,
    clean_use_redis,
)


@contextmanager
def input(*cmds):
    """Mock the input."""
    visible_cmds = "\n".join([c for c in cmds if isinstance(c, str)])
    hidden_cmds = [c.get("hidden") for c in cmds if isinstance(c, dict)]
    with mock.patch("sys.stdin", StringIO(f"{visible_cmds}\n")), mock.patch(
        "getpass.getpass", side_effect=hidden_cmds
    ):
        yield


class TestBootstrapCollector(TestCase):
    """Test the bootstrap collector."""

    maxDiff = None

    def test_clean_deployment_type(self):
        """Test cleaning the deployment type."""
        with input(""):
            self.assertEqual(clean_deployment_type(None), "digitalocean-k8s")
        with input("non-existing", ""):
            self.assertEqual(clean_deployment_type(None), "digitalocean-k8s")

    def test_clean_environment_distribution(self):
        """Test cleaning the environment distribution."""
        self.assertEqual(clean_environment_distribution(None, "other-k8s"), "1")
        with input("1", ""):
            self.assertEqual(
                clean_environment_distribution(None, "digitalocean-k8s"), "1"
            )
        with input("999", "3"):
            self.assertEqual(
                clean_environment_distribution(None, "digitalocean-k8s"), "3"
            )

    def test_clean_gitlab_group_data(self):
        """Test cleaning the GitLab group data."""
        with input("Y"):
            self.assertEqual(
                clean_gitlab_group_data(
                    "my-project",
                    "https://gitlab.com/",
                    "my-gitlab-group",
                    "mYV4l1DT0k3N",
                ),
                ("https://gitlab.com", "my-gitlab-group", "mYV4l1DT0k3N"),
            )
        with input("Y", "https://gitlab.com", "my-gitlab-group", "Y"):
            self.assertEqual(
                clean_gitlab_group_data(
                    "my-project",
                    None,
                    None,
                    "mYV4l1DT0k3N",
                ),
                ("https://gitlab.com", "my-gitlab-group", "mYV4l1DT0k3N"),
            )
        with input(
            "Y",
            "https://gitlab.com",
            "my-gitlab-group",
            "Y",
            {"hidden": "mYV4l1DT0k3N"},
        ):
            self.assertEqual(
                clean_gitlab_group_data("my-project", None, None, None),
                ("https://gitlab.com", "my-gitlab-group", "mYV4l1DT0k3N"),
            )
        self.assertEqual(
            clean_gitlab_group_data("my-project", "", "", ""),
            (None, None, None),
        )

    def test_clean_project_dirname(self):
        """Test cleaning the project directory."""
        self.assertEqual(
            clean_project_dirname("tests", "my_project", "frontend"), "tests"
        )
        with input("frontend"):
            self.assertEqual(
                clean_project_dirname(None, "my_project", "frontend"), "frontend"
            )

    def test_clean_project_slug(self):
        """Test cleaning the project slug."""
        with input("My Project"):
            self.assertEqual(clean_project_slug("My Project", None), "my-project")
        project_slug = "my-new-project"
        self.assertEqual(
            clean_project_slug("My Project", "my-new-project"), project_slug
        )

    def test_clean_sentry_dsn(self):
        """Test cleaning the Sentry DSN."""
        with input("https://public@sentry.example.com/1"):
            self.assertEqual(
                clean_sentry_dsn("https://public@sentry.example.com/1"),
                "https://public@sentry.example.com/1",
            )

    def test_clean_sentry_org(self):
        """Test cleaning the Sentry organization."""
        self.assertEqual(clean_sentry_org("MyOrganization"), "MyOrganization")
        with input("MyOrganization"):
            self.assertEqual(clean_sentry_org(None), "MyOrganization")

    def test_clean_service_dir(self):
        """Test cleaning the service directory."""
        MockedPath = mock.MagicMock(spec=Path)
        output_dir = MockedPath("mocked-tests")
        output_dir.is_absolute.return_value = True
        service_dir = MockedPath("mocked-tests/my_project")
        service_dir.is_dir.return_value = False
        output_dir.__truediv__.return_value = service_dir
        self.assertEqual(clean_service_dir(output_dir, "my_project"), service_dir)
        service_dir.is_dir.return_value = True
        output_dir.__truediv__.return_value = service_dir
        with mock.patch("bootstrap.collector.rmtree", return_value=None), input("Y"):
            self.assertEqual(clean_service_dir(output_dir, "my_project"), service_dir)

    def test_clean_service_slug(self):
        """Test cleaning the back end service slug."""
        with input(""):
            self.assertEqual(clean_service_slug(""), "frontend")
        with input("my frontend"):
            self.assertEqual(clean_service_slug(""), "myfrontend")

    def test_clean_terraform_backend(self):
        """Test cleaning the Terraform ."""
        self.assertEqual(
            clean_terraform_backend("gitlab", None, None, None, None, None),
            ("gitlab", None, None, None, None, None),
        )
        with input("gitlab"):
            self.assertEqual(
                clean_terraform_backend("wrong-backend", None, None, None, None, None),
                ("gitlab", None, None, None, None, None),
            )
        with input("terraform-cloud", "", "myOrg", "y", "bad-email", "admin@test.com"):
            self.assertEqual(
                clean_terraform_backend(
                    "wrong-backend", None, "mytfcT0k3N", None, None, None
                ),
                (
                    "terraform-cloud",
                    "app.terraform.io",
                    "mytfcT0k3N",
                    "myOrg",
                    True,
                    "admin@test.com",
                ),
            )
        with input(
            "terraform-cloud",
            "tfc.mydomain.com",
            {"hidden": "mytfcT0k3N"},
            "myOrg",
            "n",
            None,
        ):
            self.assertEqual(
                clean_terraform_backend("wrong-backend", None, None, None, None, None),
                (
                    "terraform-cloud",
                    "tfc.mydomain.com",
                    "mytfcT0k3N",
                    "myOrg",
                    False,
                    None,
                ),
            )

    def test_clean_use_redis(self):
        """Test cleaning the use Redis."""
        self.assertEqual(clean_use_redis("Y"), "Y")
