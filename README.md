# 쿠버네티스(k8s) 로컬 개발환경 구축
1. Oracle VM VirtualBox : 6.1.26 [다운로드](https://download.virtualbox.org/virtualbox/6.1.26/VirtualBox-6.1.26-145957-Win.exe)
2. Vagrant : 2.2.18 [다운로드](https://releases.hashicorp.com/vagrant/2.2.18/vagrant_2.2.18_x86_64.msi)
```bat
mkdir k8s
cd k8s
curl -O https://raw.githubusercontent.com/kjd4717/orange/main/vagrant/Vagrantfile
vagrant up
```
