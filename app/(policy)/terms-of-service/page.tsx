import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服务条款 | AI Landing Page & Blog Generator',
  description: '使用我们服务的条款和条件',
}

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">服务条款</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600">最后更新日期：2024年3月20日</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">1. 服务说明</h2>
          <p>我们提供AI驱动的内容生成服务，包括但不限于：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>AI落地页生成</li>
            <li>AI博客文章生成</li>
            <li>AI角色生成</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">2. 用户责任</h2>
          <p>作为用户，您同意：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>提供准确的���册信息</li>
            <li>对账户活动负责</li>
            <li>不得滥用或非法使用我们的服务</li>
            <li>不得侵犯他人知识产权</li>
            <li>遵守所有适用的法律法规</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">3. 知识产权</h2>
          <p>关于AI生成内容的知识产权规定：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>用户通过我们的服务生成的内容，其权利归用户所有</li>
            <li>我们的服务、商标和技术仍属于我们的财产</li>
            <li>用户需确保上传的内容不侵犯第三方权利</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">4. 服务限制</h2>
          <p>我们保留以下权利：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>修改或终止服务的任何部分</li>
            <li>限制服务使用量</li>
            <li>拒绝或删除不当内容</li>
            <li>暂停或终止违规账户</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">5. 免责声明</h2>
          <p>我们的服务按&quot;现状&quot;提供，我们：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>不保证服务不会中断或无错误</li>
            <li>不对AI生成内容的准确性负责</li>
            <li>不对用户使用生成内容造成的后果负责</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">6. 付费服务</h2>
          <p>关于付费服务：</p>
          <ul className="list-disc pl-6 mt-2">
            <li>所有价格均以实际显示为准</li>
            <li>我们保留修改价格的权利</li>
            <li>退款政策遵循具体订阅计划的规定</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">7. 服务变更</h2>
          <p>我们保留随时修改这些条款的权利。重大变更将通过电子邮件或网站通知通知用户。继续使用我们的服务即表示您接受修改后的条款。</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">8. 联系方式</h2>
          <p>如果您对我们的&quot;服务条款&quot;有任何疑问，请联系我们：</p>
          <p className="mt-2">邮箱：support@example.com</p>
        </section>
      </div>
    </div>
  )
}
