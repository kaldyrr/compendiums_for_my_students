# Компендиум по Linux

Практический путеводитель по Linux для студентов: базовые команды, файловая система, права, процессы, сеть, пакеты, `systemd`, удалённая работа и диагностика. Основной фокус - Ubuntu/Debian, а в местах различий даны короткие примечания для Red Hat/Fedora и macOS.

---

## 1. Что такое Linux
- Linux - это ядро. В повседневной работе вы взаимодействуете с дистрибутивом: Ubuntu, Debian, Fedora, Arch, openSUSE и т.д.
- Почти все задачи делаются через терминал: навигация, редактирование, администрирование, автоматизация.
- Базовая единица работы - команда, файл и процесс.

### Термины
- **Shell** - оболочка командной строки, чаще всего `bash` или `zsh`.
- **Terminal** - окно, в котором запущена shell.
- **Root** - административный пользователь.
- **Package manager** - менеджер пакетов: `apt`, `dnf`, `pacman`, `zypper`.

---

## 2. Первые команды
```bash
pwd                # показать текущую папку
whoami             # текущий пользователь
uname -a           # сведения о системе
hostnamectl        # имя хоста и ОС
date               # текущие дата и время
cal                # календарь
```

### Помощь
```bash
man ls             # справка по команде
ls --help          # краткая помощь
apropos network    # поиск по man-страницам
```

---

## 3. Файловая система
- Корень файловой системы - `/`.
- Часто используемые каталоги:
  - `/home` - домашние каталоги пользователей.
  - `/etc` - конфигурация системы.
  - `/var` - изменяемые данные: логи, кеши, очереди.
  - `/usr` - программы и библиотеки.
  - `/bin`, `/sbin`, `/lib` - системные утилиты и библиотеки.
  - `/tmp` - временные файлы.
  - `/dev` - устройства.
  - `/proc`, `/sys` - виртуальные файловые системы ядра.

### Навигация
```bash
ls -lah           # список файлов с деталями
cd /etc           # переход в каталог
cd ..             # на уровень выше
cd -              # вернуться в предыдущий каталог
tree -L 2         # дерево каталогов
```

### Пути
- Абсолютный путь начинается с `/`.
- Относительный путь считается от текущей папки.
- `.` - текущая папка, `..` - родительская.

### Ссылки
```bash
ln file.txt hardlink.txt        # жёсткая ссылка
ln -s /etc/hosts hosts-link     # символическая ссылка
readlink -f hosts-link          # показать реальный путь
```

---

## 4. Работа с файлами
```bash
touch notes.txt                 # создать пустой файл
mkdir -p projects/linux         # создать каталог и родителей
cp file1.txt file2.txt          # копирование
cp -r src/ backup/src/          # рекурсивное копирование каталога
mv old.txt new.txt              # переименование или перенос
rm file.txt                     # удалить файл
rm -r old_dir                   # удалить каталог
```

### Просмотр содержимого
```bash
cat file.txt
less file.txt
head -n 20 file.txt
tail -n 20 file.txt
tail -f /var/log/syslog
```

### Поиск файлов
```bash
find . -name "*.log"
find /var -type f -size +100M
locate nginx.conf
updatedb                         # обновить базу locate
```

---

## 5. Права доступа
- У каждого файла есть владелец, группа и права для `user`, `group`, `others`.
- Права бывают `r` (read), `w` (write), `x` (execute).

### Просмотр и изменение
```bash
ls -l
chmod 644 file.txt               # rw-r--r--
chmod +x script.sh               # сделать исполняемым
chown user:group file.txt        # сменить владельца и группу
chgrp developers file.txt        # сменить группу
```

### Расшифровка
- `755` - владелец читает, пишет, выполняет; остальные читают и выполняют.
- `644` - владелец читает и пишет; остальные только читают.

### Важные команды
```bash
umask                            # маска прав по умолчанию
sudo command                     # выполнить с правами администратора
sudo -i                          # интерактивная root-сессия
```

### ACL
```bash
getfacl file.txt
setfacl -m u:alice:rw file.txt
```

---

## 6. Пользователи и группы
```bash
id
groups
useradd -m student
passwd student
usermod -aG sudo student
getent passwd student
```

### Практика безопасности
- Не работайте постоянно от `root`.
- Используйте `sudo` только для конкретной команды.
- Проверяйте, в какую группу добавляете пользователя, особенно `sudo`, `docker`, `adm`.

---

## 7. Процессы и задания
```bash
ps aux
top
htop
pgrep nginx
kill 12345
kill -9 12345
pkill firefox
nice -n 10 command
renice 5 -p 12345
```

### Управление фоном
```bash
command &
jobs
fg %1
bg %1
nohup long_task &
```

### Полезные заметки
- `kill` отправляет сигнал, а не всегда сразу убивает процесс.
- `SIGTERM` - корректное завершение, `SIGKILL` - принудительное.

---

## 8. Перенаправление и конвейеры
```bash
command > out.txt        # stdout в файл
command >> out.txt       # добавить в конец файла
command 2> err.txt       # stderr в файл
command > all.txt 2>&1   # stdout и stderr вместе
command1 | command2      # pipe
cat file | grep text     # так можно, но лучше grep text file
```

### Полезные приёмы
- `tee` пишет поток и в файл, и на экран.
```bash
make 2>&1 | tee build.log
```
- `xargs` превращает ввод в аргументы команды.
```bash
find . -name "*.tmp" -print0 | xargs -0 rm -f
```

---

## 9. Поиск и обработка текста
```bash
grep -n "error" app.log
grep -ri "timeout" .
grep -v "^#" config.ini
sort names.txt | uniq
cut -d: -f1 /etc/passwd
wc -l file.txt
```

### `sed`
```bash
sed 's/old/new/g' file.txt
sed -n '1,10p' file.txt
```

### `awk`
```bash
awk '{print $1, $NF}' file.txt
awk -F: '$3 >= 1000 {print $1}' /etc/passwd
```

### Когда использовать
- `grep` - искать строки.
- `sed` - простые преобразования текста.
- `awk` - табличные данные и полевые операции.

---

## 10. Архивация и сжатие
```bash
tar -cvf backup.tar dir/
tar -xvf backup.tar
tar -czvf backup.tar.gz dir/
tar -xzvf backup.tar.gz
zip -r archive.zip dir/
unzip archive.zip
gzip file.txt
gunzip file.txt.gz
```

### Практика
- Для бэкапов чаще используют `tar.gz` или `tar.zst`.
- Для больших каталогов удобно сочетать `tar` и `rsync`.

---

## 11. Сеть
```bash
ip a
ip r
ss -tulpn
ping -c 4 8.8.8.8
curl -I https://example.com
wget https://example.com/file.txt
dig example.com
traceroute example.com
```

### Проверка портов и сервисов
```bash
nc -vz example.com 443
curl http://localhost:8080/health
```

### `nmcli`
```bash
nmcli device status
nmcli connection show
```

### Remote copy
```bash
ssh user@server
scp file.txt user@server:/tmp/
rsync -avh --progress ./project/ user@server:/srv/project/
```

---

## 12. Установка пакетов
### Ubuntu/Debian
```bash
sudo apt update
sudo apt upgrade
sudo apt install curl git htop tree
sudo apt remove package-name
sudo apt autoremove
apt search nginx
apt show nginx
```

### Red Hat/Fedora
```bash
sudo dnf install curl git htop tree
sudo dnf update
sudo dnf remove package-name
```

### Arch
```bash
sudo pacman -S curl git htop tree
sudo pacman -Syu
```

### macOS
- На macOS чаще используют `brew install ...`.
- Многие команды Linux доступны, но `systemd` обычно отсутствует.

### Практика
- Обновляйте индекс пакетов перед установкой.
- Предпочитайте пакеты из официальных репозиториев.
- Для языковых toolchain используйте штатные менеджеры: `pipx`, `uv`, `npm`, `go`, `cargo`, `rustup`.

---

## 13. systemd и службы
```bash
systemctl status ssh
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl enable nginx
systemctl disable nginx
systemctl is-enabled nginx
```

### Журналы
```bash
journalctl -u nginx
journalctl -u nginx -f
journalctl --since "today"
journalctl -p err
```

### Полезно знать
- `enable` включает автозапуск при загрузке.
- `restart` перезапускает службу, `reload` перечитывает конфиг, если это поддерживается.

---

## 14. Диски и файловые системы
```bash
df -h
du -sh *
lsblk
blkid
mount
umount /mnt/data
```

### Диагностика места
```bash
du -sh /var/log/*
find / -xdev -type f -size +1G
```

### Практика
- Проверяйте свободное место и inode, если система ведёт себя странно.
- Не редактируйте вручную файлы на смонтированных read-only разделах без понимания причины.

---

## 15. Bash и переменные окружения
```bash
echo "$HOME"
export APP_ENV=dev
printenv APP_ENV
env | sort
```

### Файлы профиля
- `~/.bashrc` - настройки интерактивной shell.
- `~/.profile` или `~/.bash_profile` - входная shell.
- `~/.zshrc` - если используется zsh.

### Пример
```bash
export PATH="$HOME/bin:$PATH"
alias ll='ls -lah'
```

### Безопасность
- Не храните секреты в открытом виде в shell history.
- Для временных переменных используйте `VAR=value command`.

---

## 16. Основы Bash-скриптов
```bash
#!/usr/bin/env bash
set -euo pipefail

name="${1:-student}"
echo "Hello, $name"
```

### Полезные правила
- Всегда ставьте shebang.
- Используйте `set -euo pipefail` для более строгого поведения.
- Кавычки вокруг переменных нужны почти всегда: `"$var"`.
- Проверяйте аргументы и код возврата.

### Условные конструкции
```bash
if [ -f "$1" ]; then
  echo "Файл существует"
fi
```

### Цикл
```bash
for f in *.log; do
  echo "$f"
done
```

---

## 17. Диагностика и отладка
```bash
which python
type -a ls
file app.bin
strace -f -o trace.log command
lsof -i :8080
fuser -v 8080/tcp
```

### Системные логи
```bash
journalctl -xe
dmesg -T | tail -n 50
```

### Сетевые проблемы
- Проверьте DNS: `resolvectl status`, `dig`, `nslookup`.
- Проверьте доступность порта: `ss`, `nc`, `curl`.
- Сравнивайте поведение `localhost`, IP и внешнего адреса.

---

## 18. Безопасная работа
- Не запускайте непроверенные команды через `curl | sh`.
- Читайте команды перед `sudo`.
- Удаление делайте осознанно: сначала `ls`, потом `rm`.
- Для массовых операций сначала тестируйте с `echo` или `-print`.

### Безопасные привычки
```bash
find . -name "*.bak" -print
find . -name "*.bak" -delete
```
Сначала проверьте вывод без удаления.

### SSH
- Используйте ключи вместо паролей.
- Закрывайте доступ к приватному ключу: `chmod 600 ~/.ssh/id_ed25519`.
- Для удобства храните настройки в `~/.ssh/config`.

---

## 19. Полезный набор команд на каждый день
```bash
ls -lah
cd /path
grep -R "text" .
find . -type f -name "*.py"
tail -f /var/log/syslog
ssh user@host
rsync -avh source/ dest/
systemctl status service
```

---

## 20. Мини-памятка
- Сначала `man`, потом `sudo`.
- Сначала `grep/find`, потом `rm`.
- Сначала `systemctl status` и `journalctl`, потом перезапуск.
- Сначала маленькая команда, потом массовая автоматизация.

