deployments = {
  {{ cookiecutter.service_slug }} = {
    port = "{{ cookiecutter.internal_service_port }}"
  }
}
service_slug              = "{{ cookiecutter.service_slug }}"
shared_secret_values_json = "shared-secrets.tftpl.json"
