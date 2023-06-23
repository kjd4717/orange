# 온프레미스 환경에서 metal-lb 설치 / v0.9.5

### 1. metal-lb 설치

```bash
kubectl apply -f https://raw.githubusercontent.com/kjd4717/orange/main/yaml/metal-lb-v0.9.5/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/kjd4717/orange/main/yaml/metal-lb-v0.9.5/metallb.yaml
kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
```
### 2. configmap  설치
```bash
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.56.21-192.168.56.22
```
=>
```bash
```