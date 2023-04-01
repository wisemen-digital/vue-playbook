<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/12672784?v=4',
    name: 'Kiryl Maltsav',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/maltsavkiryl' },
    ]
  },
]
</script>

# Meet the team

This project is maintained by a team of passionate web developers. We are always looking for people to help us improve this project.
If you are interested in helping, check out our [github](https://github.com/appwise-labs/frontend-bible) and make a pull request!

<VPTeamMembers size="small" :members="members" />
