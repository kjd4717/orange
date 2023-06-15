# 쿠버네티스(k8s) 로컬 개발환경 구축
#### 1. XShell 설치 : 생성될 Master/Woker Node에 접속할 툴 [다운로드](https://www.netsarang.com/en/free-for-home-school/)
#### 2. Oracle VM VirtualBox v6.1.26 설치 : VM 및 내부 네트워크 생성 툴 [다운로드](https://download.virtualbox.org/virtualbox/6.1.26/VirtualBox-6.1.26-145957-Win.exe)
#### 3. Vagrant 설치 및 k8s 설치 스크립트 실행 : 자동으로 VirtualBox를 이용해 VM들을 생성하고, K8S관련 설치 파일들이 실행됨
```bat
mkdir k8s
cd k8s
curl -O https://raw.githubusercontent.com/kjd4717/orange/main/vagrant/Vagrantfile
vagrant up
```
#### 4. Worker Node 연결 : Worker Node들을 Master에 연결하여 쿠버네티스 클러스터 구축
* XShell을 통해 master 접속 (id/pw: root/vagrant)
* cat 명령으로 자신에 master 접근 token 확인 및 복사
```bash
[root@k8s-node1 ~]# cat ~/join.sh
[root@k8s-node1 ~]# kubeadm join 192.168.56.30:6443 --token bver73.wda72kx4afiuhspo --discovery-token-ca-cert-hash sha256:7205b3fd6030e47b74aa11451221ff3c77daa0305aad0bc4a2d3196e69eb42b7
```
* worker node1 접속 후 토큰 붙여놓기 (id/pw: root/vagrant)
```bash
[root@k8s-node1 ~]# kubeadm join 192.168.56.30:6443 --token bver73.wda72kx4afiuhspo --discovery-token-ca-cert-hash sha256:7205b3fd6030e47b74aa11451221ff3c77daa0305aad0bc4a2d3196e69eb42b7
```
#### 5. 설치 확인 : Node와 Pod 상태 조회
* XShell을 통해 master 접속 (id/pw = root/vagrant)
* kubectl 명령어
```bash
[root@k8s-master ~]# kubectl get pod -A
[root@k8s-master ~]# kubectl get nodes
```
#### 7. 대시보드 접근 : Host OS에서 웹 브라우저를 이용해 클러스터 Dashboard에 접근 <br />
http://192.168.56.30:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/workloads?namespace=default

## 참고
### Version 정보
![Alt text](https://raw.githubusercontent.com/kjd4717/orange/main/assets/images/version.jpg)

### Network
![Alt text](https://raw.githubusercontent.com/kjd4717/orange/main/assets/images/network.jpg)


