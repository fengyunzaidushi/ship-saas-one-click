# Treee 命令使用指南

## 基本用法

```bash
# 显示当前目录结构
treee

# 显示指定目录结构
treee ./apps
```

## 常用选项

```bash
# 忽略特定目录
treee -I "node_modules|.git|.next|dist"

# 限制显示层级
treee -L 3

# 只显示目录
treee -d

# 显示文件大小
treee -s
```

## 项目常用命令

```bash
# 生成项目结构（忽略常见开发文件）
treee -I "node_modules|.git|.next|.contentlayer|.husky |packages|.vscode|.turbo|tests|ui|public|LICENSE|test.http" > tree.md

# 只显示源代码目录
treee ./apps/web/src -L 3

# 只显示特定类型文件
treee -P "*.ts|*.tsx"
```

## 输出选项

```bash
# 使用 UTF-8 编码（解决中文问题）
treee --charset utf-8

# 显示完整路径
treee --full-path
```

## 帮助命令

```bash
# 显示所有可用选项
treee --help
```
