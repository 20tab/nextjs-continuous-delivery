{% if "environment" in cookiecutter.tfvars %}{% for item in cookiecutter.tfvars.environment|sort %}{{ item }}
{% endfor %}{% endif %}# service_container_port="{{ cookiecutter.internal_service_port }}"
# service_replicas=1
