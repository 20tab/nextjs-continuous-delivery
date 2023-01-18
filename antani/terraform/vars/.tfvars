{% if "environment" in cookiecutter.tfvars %}{% for item in cookiecutter.tfvars.environment|sort %}{{ item }}
{% endfor %}{% endif %}# service_container_port="{{ cookiecutter.internal_service_port }}"
service_limits_cpu="225m"
service_limits_memory="256Mi"
# service_replicas=1
service_requests_cpu="25m"
service_requests_memory="115Mi"
