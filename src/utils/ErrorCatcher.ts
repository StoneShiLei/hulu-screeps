export class ErrorCatcher {
    private static errors: string[] = []
    private static print: number = 0

    static catch<T = any>(func: Function, message?: string): T | undefined {
        try {
            return func()
        } catch (e) {
            let data = (e as any).stack
            if (message) data = "\n" + message + "\n" + (e as any).stack
            this.errors.push(data + "\n\n**************\n")
            return undefined
        }
    }

    static throwAll() {
        if (this.errors.length) {
            let tmp = this.errors
            this.errors = []
            if (!tmp.length) {
                this.print = 0
            }
            if (this.print) {
                this.print += 1
                if (this.print > 10) {
                    this.print = 0
                }
                console.log(tmp)
            }
            else {
                this.print += 1
                throw new Error(tmp.join())
            }
        }
    }
}
