# 준비
#### 1. PALETTE-UI
  * Dockerfile 설정
  ![img_4.png](assets/img_4.png)

  * 도커파일 실행 & 사내도커허브에 이미지생성 
  ![img_5.png](assets/img_5.png)

  * 사내도커 허브에서 이미지 태깅 & github repository에 push
    - 172.16.0.100 ssh 접속후
    ```bash    
    docker login ghcr.io -u kjd4717 -p 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
    docker tag palette3-ui:2023.0718.001 ghcr.io/kjd4717/palette3-ui:2023.0718.001
    docker push ghcr.io/kjd4717/palette3-ui:2023.0718.001
    ```
    ![img_6.png](assets/img_6.png)
    => # GitHub 개인 Profile > Packages 에서 확인
    ![img_7.png](assets/img_7.png)

#### 2. PALETTE-API 
  * Dockerfile 설정
    ![img_8.png](assets/img_8.png)
  * 도커파일 실행 & 사내도커허브에 이미지생성
  * 사내도커 허브에서 이미지 태깅 & github repository에 push
    - 172.16.0.100 ssh 접속후    
    ```bash    
    docker login ghcr.io -u kjd4717 -p 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
    docker tag palette3-api:2023.0718.001 ghcr.io/kjd4717/palette3-api:2023.0718.001
    docker push ghcr.io/kjd4717/palette3-api:2023.0718.001
    ```

# GKE
#### 1. DB생성

#### 1. 구글콘솔 클러스터 연결
  ```bash
  gcloud container clusters get-credentials palette-cluster-1 --zone asia-northeast3-b --project palette-393108
  ```
  ![img.png](assets/img1.png)

#### 1. github연동 kjd4717계정에 대한 1년짜리로 키 생성 후 함. 
  ```bash
  echo "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" > ~/GITHUB_TOKEN.txt 
  cat ~/GITHUB_TOKEN.txt | docker login https://ghcr.io -u kjd4717 --password-stdin    
  kubectl create secret docker-registry palette3-git-regcred --docker-server=ghcr.io --docker-username=kjd4717 --docker-password=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 --docker-email=jongdeog@gmail.com  
  ```  


#### 2. FileStore생성
  ![img.png](assets/img.png)
  ![img_2.png](assets/img_2.png)
  ![img_3.png](assets/img_3.png)

* GKE Filestore CSI 드라이버가 사용 설정되면 사용자는 다음 구성으로 GKE 제공 멀티 공유 StorageClass enterprise-multishare-rwx에 액세스할 수 있음.
  ```bash
    -사용설정
    gcloud container clusters update palette-cluster-1 --update-addons=GcpFilestoreCsiDriver=ENABLED --location asia-northeast3-b
  
    -사용중지
    gcloud container clusters update CLUSTER_NAME --update-addons=GcpFilestoreCsiDriver=DISABLED --location asia-northeast3-b
  
    --생성확인
    kubectl describe sc enterprise-multishare-rwx
  
  ```
* 인스턴스 액세스를 위한 StorageClass, PersistentVolume 및 PersistentVolumeClaim 만들기 - palette-filestore-pv.yaml
  ```bash
    -생성확인
      kubectl get pv
  ```

#### 2. palette-configmap 생성
  ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: palette-configmap
    data:
      SERVER_PORT: "8080"
      SPRING_PROFILES_ACTIVE: production,production-chat,production-phone
      SPRING_APPLICATION_NAME: palette3-api
      PALETTE_ROOT-DIR: /orange/app/palette3
      PALETTE_WEBAPPS-DIR: /orange/app/palette3/webapps
      PALETTE_CHAT_CIPHER: "Y"
      PALETTE_CHAT_KEY: MnR6bzI4bjdocGEw
      JASYPT_KEY: paletteHello
      CHAT_ENABLED: "false"
      CHAT_ROUTER-ENABLED: "false"
  ```
  * worker node1 접속 후 토큰 붙여놓기 (id/pw: root/vagrant)
  ```bash
  [root@k8s-node1 ~]# kubeadm join 192.168.56.30:6443 --token bver73.wda72kx4afiuhspo --discovery-token-ca-cert-hash sha256:7205b3fd6030e47b74aa11451221ff3c77daa0305aad0bc4a2d3196e69eb42b7
  ```

#### 3. palette-ui, palette-api, palette-auth, palette-chat, palette-phone 생성. 

#### 4. 인그레스용 gcloud 명령을 이용하여, global IP를 생성한다 생성. 
  ```bash
  gcloud compute addresses create palette3-ingress-ip --global
  ```
  ![img_9.png](assets/img_9.png)

#### 4. 인그레스 생성. 
  * SSL 작업(임시용도)
    ```bash 
    openssl genrsa -out ingress-palette3.key 2048
    openssl req -new -key ingress-palette3.key -out ingress-palette3.csr
    openssl x509 -req -days 9999 -in ingress-palette3.csr -signkey ingress-palette3.key -out ingress-palette3.crt
    ```
    ![img_10.png](assets/img_10.png)
    
    ```bash
    kubectl create secret tls ingress-palette3-serect --key ./ingress-palette3.key --cert ./ingress-palette3.crt
    ```

  * 1
    ```yaml
    apiVersion: networking.k8s.io/v1
      kind: Ingress
      metadata:
        name: ingress-palette3
        annotations:
          kubernetes.io/ingress.global-static-ip-name: "palette3-ingress-ip"
      spec:
        tls:
          - secretName: ingress-palette3-serect
        rules:
          - http:
              paths:
                - path: /
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-ui
                      port:
                        number: 3003
                - path: /api
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-api
                      port:
                        number: 8080
                - path: /auth-api
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-auth
                      port:
                        number: 8080
                - path: /chat-api
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-chat
                      port:
                        number: 8080
                - path: /phone-api
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-phone
                      port:
                        number: 8080
                - path: /sockjs-node
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-ui
                      port:
                        number: 3003
                - path: /secured/ws-stomp
                  pathType: Prefix
                  backend:
                    service:
                      name: palette3-api
                      port:
                        number: 8080
    ```