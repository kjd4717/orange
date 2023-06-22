# metallb/v0.9.5

```bash
kubectl apply -f https://raw.githubusercontent.com/kjd4717/orange/main/yaml/metal-lb-v0.9.5/namespace.yaml
kubectl apply -f https://raw.githubusercontent.com/kjd4717/orange/main/yaml/metal-lb-v0.9.5/metallb.yaml
kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
```