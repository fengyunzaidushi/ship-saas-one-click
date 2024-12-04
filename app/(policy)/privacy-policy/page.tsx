import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '隐私政策 | AI Landing Page & Blog Generator',
  description: '了解我们如何收集、使用和保护您的个人信息',
}

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">隐私政策</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600">最后更新日期：2024年3月20日</p>
        
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">1. 信息收集</h2>
          <p>我们收集以下类型的信息：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>账户信息（电子邮件、用户名等）</li>
            <li>使用我们服务时产生的内容</li>
            <li>设备信息和日志数据</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">2. 信息使用</h2>
          <p>我们使用收集的信息用于：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>提供、维护和改进我们的服务</li>
            <li>处理您的支付交易</li>
            <li>发送服务通知和更新</li>
            <li>防止欺诈和滥用</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">3. 信息共享</h2>
          <p>我们不会出售您的个人信息。我们仅在以下情况下共享信息：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>经您同意</li>
            <li>与服务提供商合作</li>
            <li>法律要求</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">4. 数据安全</h2>
          <p>我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">5. 您的权利</h2>
          <p>您有权：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>访问您的个人信息</li>
            <li>更正不准确的信息</li>
            <li>要求删除您的信息</li>
            <li>反对或限制处理您的信息</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">6. Cookie政策</h2>
          <p>我们使用Cookie和类似技术来改善用户体验。您可以通过浏览器设置控制Cookie的使用。</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">7. 联系我们</h2>
          <p>如果您对我们的隐私政策有任何疑问，请通过以下方式联系我们：</p>
          <p className="mt-2">邮箱：support@example.com</p>
        </section>
      </div>
    </div>
  )
}
